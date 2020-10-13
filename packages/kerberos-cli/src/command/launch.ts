import fs from 'fs-extra'
import path from 'path'
import { program } from 'commander'
import { gitClone } from '../services/git'
import { openJsonFile } from '../services/fileMemory'
import { getConfig } from '../services/project'
import { getDependencies } from '../services/pm'
import { tmpPath, configFileName } from '../constants/conf'
import isDogeProject from './share/isDogeProject'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(folder: string, workspace: string, options?: Types.CLILsOptions): Promise<void> {
  const tmp = path.join(tmpPath, 'launch')
  if (await fs.pathExists(tmp)) {
    await fs.remove(tmp)
  }

  await fs.ensureDir(tmp)
  if (!(await gitClone(workspace, tmp, 'doge'))) {
    throw new Error(i18n.COMMAND__CLONE__ERROR_FAILE_CLONE``)
  }

  const doge = path.join(tmp, 'doge')
  if (!(await isDogeProject(doge))) {
    return
  }

  const cfgSource = await getConfig(path.join(doge, configFileName))
  const projects = cfgSource?.projects || []

  const gitCloneDeps = async (name: string) => {
    const project = projects.find((project) => project.name === name)
    if (!project) {
      return
    }

    await gitClone(project?.repository, tmp, name)

    const pkgFile = path.join(tmp, name, 'package.json')
    const pkgSource: Types.CPackage = await openJsonFile(pkgFile)
    const dependencies = getDependencies(pkgSource)
    const deps = cfgSource?.projects.filter(({ name }) => -1 !== dependencies.indexOf(name))

    await Promise.all(
      deps.map(async ({ name }) => {
        await gitCloneDeps(name)
      })
    )
  }

  const pkgFile = path.join(folder, 'package.json')
  const pkgSource: Types.CPackage = await openJsonFile(pkgFile)
  await gitCloneDeps(pkgSource.name)
}

program
  .command('launch <folder> <workspace>')
  .description(i18n.COMMAND__LS__DESC``)
  .action((folder: string, workspace: string, options?: Types.CLILsOptions) => intercept([], ['context'])(takeAction)(folder, workspace, options))
