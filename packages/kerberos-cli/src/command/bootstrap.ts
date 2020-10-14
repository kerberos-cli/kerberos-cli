import fs from 'fs-extra'
import path from 'path'
import { program } from 'commander'
import waterfall from 'promise-waterfall'
import { getConfig, getProjectInfoCollection } from '../services/project'
import { spawn } from '../services/process'
import { success } from '../services/logger'
import { confirm, multiSelect } from '../services/ui'
import { isWindows } from '../utils/os'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(options?: Types.CLIBootstrapOptions): Promise<void> {
  const { yes, install: yarnInstall, clone: gitClone, optional } = options

  if (gitClone === true) {
    const config = await getConfig()
    const pkgFile = path.join(process.cwd(), 'package.json')
    if (!(await fs.pathExists(pkgFile))) {
      throw new Error(i18n.COMMAND__BOOTSTRAP__ERROR_INVALID_PACKAGE``)
    }

    // 克隆所有仓库
    const projects = config?.projects || []
    const existsProjects = (await getProjectInfoCollection()).map((project) => project.name)
    const necessaries: Types.CProject[] = []
    const optionals: Types.CProject[] = []
    const codes: number[] = []
    const install = async (projects: Types.DProjectInConfChoice[]) => {
      const codes = []
      const tasks = projects.map(({ name, workspace, repository }) => async () => {
        const wsFolder = path.join(process.cwd(), workspace)
        await fs.ensureDir(wsFolder)

        const params = ['clone', repository, name]
        const code = await spawn('git', params, { cwd: wsFolder, shell: true })
        codes.push(code)
      })

      if (tasks.length === 0) {
        return codes
      }

      if (options?.sequence) {
        await waterfall(tasks)
        return codes
      }

      Promise.all(tasks.map((exec) => exec()))
      return codes
    }

    projects.forEach((project) => {
      if (-1 === existsProjects.indexOf(project.name)) {
        if (project.optional === true) {
          optionals.push(project)
        } else {
          necessaries.push(project)
        }
      }
    })

    // 安装依赖
    const nCodes = await install(necessaries)
    codes.push(...nCodes)

    if (optionals.length > 0) {
      if (yes) {
        if (optional) {
          const oCodes = await install(optionals)
          codes.push(...oCodes)
        }
      } else {
        if (await confirm(i18n.COMMAND__BOOTSTRAP__CONFIRM_INSTALL_OPTIONAL``, false)) {
          const selectedProjects = await multiSelect('projectInConfig')(i18n.COMMAND__BOOTSTRAP__SELECT_CLONE_PROJECT``, optionals)
          const oCodes = await install(selectedProjects)
          codes.push(...oCodes)
        }
      }
    }
  }

  if (yarnInstall === true) {
    if (yes || (await confirm(i18n.COMMAND__BOOTSTRAP__CONFIRM_INSTALL_DEPEDENCIES``))) {
      await spawn('yarn', [], { shell: true })
    }
  }

  try {
    const projectInfo = await getProjectInfoCollection()
    await Promise.all(
      projectInfo.map(async ({ name, folder }) => {
        const softlink = path.join(process.cwd(), 'node_modules', name)
        if (!(await fs.pathExists(softlink))) {
          // windows 下 dir 需要 Admin 权限
          await fs.symlink(folder, softlink, isWindows() ? 'junction' : 'dir')
        }

        await Promise.all(
          projectInfo.map(async ({ name: cName, folder: cFolder }) => {
            if (cName === name) {
              return
            }

            const dep = path.join(cFolder, 'node_modules', name)
            if (await fs.pathExists(dep)) {
              await fs.remove(dep)
            }
          })
        )
      })
    )
  } catch (error) {
    // nothing todo...
  }

  success(i18n.COMMAND__BOOTSTRAP__SUCCESS_COMPLETE``)
}

program
  .command('bootstrap')
  .description(i18n.COMMAND__BOOTSTRAP__DESC``)
  .option('--no-clone', i18n.COMMAND__BOOTSTRAP__OPTION_NO_CLONE``)
  .option('--no-install', i18n.COMMAND__BOOTSTRAP__OPTION_NO_INSTALL``)
  .option('-y, --yes', i18n.COMMAND__BOOTSTRAP__OPTION_YES``)
  .option('-o, --optional', i18n.COMMAND__BOOTSTRAP__OPTION_OPTIONAL``)
  .option('-S, --sequence', i18n.COMMAND__BOOTSTRAP__OPTION_SEQUENCE``)
  .action((options: Types.CLIBootstrapOptions) => intercept()(takeAction)(options))
