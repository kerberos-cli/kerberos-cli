import fs from 'fs-extra'
import path from 'path'
import { program } from 'commander'
import { openJsonFile } from '../services/fileMemory'
import { getDependencies } from '../services/pm'
import { gitClone, getBranch } from '../services/git'
import { getConfig } from '../services/project'
import { success } from '../services/logger'
import { configProjectFolderName, configFileName, workspacePackageFileName, workspaceDefaultName, tmpPath } from '../constants/conf'
import { linkFile } from './init'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(repo: string, options?: Types.CLIInstallOptions): Promise<void> {
  const folder = process.cwd()
  const branch = options?.branch || (await getBranch(folder))
  const tmpFolder = path.join(tmpPath, workspaceDefaultName)
  await fs.remove(tmpFolder)

  if (!(await gitClone(repo, tmpFolder, configProjectFolderName, branch))) {
    throw new Error(i18n.COMMAND__CLONE__ERROR_FAILE_CLONE``)
  }

  // 拉取配置项目
  const cfgTmpFolder = path.join(tmpFolder, configProjectFolderName)
  const cfgSource = await getConfig(path.join(cfgTmpFolder, configFileName))
  const projects = cfgSource?.projects || []
  const pkgFile = path.join(folder, 'package.json')
  const pkgSource: Types.CPackage = await openJsonFile(pkgFile)
  const curProject = projects.find(({ name }) => pkgSource.name === name)
  if (!curProject?.workspace) {
    throw new Error(i18n.COMMAND__CLONE__ERROR_PROJECT_NOT_FOUND``)
  }

  // 移动本地项目
  const files = await fs.readdir(folder)
  const curProjectFolder = path.join(folder, curProject.workspace, pkgSource.name)

  await fs.ensureDir(curProject.workspace)
  await Promise.all(
    files.map(async (name) => {
      const file = path.join(folder, name)
      const dest = path.join(curProjectFolder, name)
      await fs.move(file, dest)
    })
  )

  // 移动配置项目
  const cfgPkgSource: Types.CPackage = await openJsonFile(path.join(cfgTmpFolder, 'package.json'))
  const cfgProject = projects.find(({ name }) => cfgPkgSource.name === name)
  const cfgProjectFolder = path.join(folder, cfgProject.workspace, configProjectFolderName)
  await fs.move(cfgTmpFolder, cfgProjectFolder)

  // 拉取子项目
  const existsProjects = [pkgSource.name]
  const gitCloneDeps = async (dependencies: string[]): Promise<void> => {
    await Promise.all(
      dependencies.map(async (name: string) => {
        if (existsProjects.indexOf(name) !== -1) {
          return
        }

        const project = projects.find((project) => project.name === name)
        if (!project) {
          return
        }

        existsProjects.push(name)

        const { repository, workspace } = project
        if (!repository) {
          return
        }

        const destFolder = path.join(folder, workspace)
        await gitClone(repository, destFolder, name, branch)

        const pkgSource: Types.CPackage = await openJsonFile(path.join(destFolder, name, 'package.json'))
        const dependencies = getDependencies(pkgSource)
        await gitCloneDeps(dependencies)
      })
    )
  }

  const dependencies = getDependencies(pkgSource)
  await gitCloneDeps(dependencies)

  // 添加软链到外层
  const configFile = path.join(cfgProjectFolder, configFileName)
  const packageFile = path.join(cfgProjectFolder, workspacePackageFileName)
  await linkFile(configFile, path.join(folder, configFileName))
  await linkFile(packageFile, path.join(folder, 'package.json'))

  success(i18n.COMMAND__INSTALL__SUCCESS_COMPLETE``)
}

program
  .command('install <repo>')
  .description(i18n.COMMAND__INSTALL__DESC``, {
    repo: i18n.COMMAND__INSTALL__ARGS_REPO``,
  })
  .option('-b, --branch <branch>', i18n.COMMAND__INSTALL__OPTION_BRANCH``)
  .action((folder: string, repo?: string, options?: Types.CLIInstallOptions) => intercept(['tryAction', 'supported'])(takeAction)(folder, repo, options))
