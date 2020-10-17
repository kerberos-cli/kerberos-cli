import fs from 'fs-extra'
import path from 'path'
import { program } from 'commander'
import waterfall from 'promise-waterfall'
import { getConfig, getProjectInfoCollection, getConfigBranch } from '../services/project'
import { spawn } from '../services/process'
import { gitClone } from '../services/git'
import { success } from '../services/logger'
import { confirm, multiSelect } from '../services/ui'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(options?: Types.CLIBootstrapOptions): Promise<void> {
  const { yes, install: yarnInstall, clone: isGitClone, optional } = options

  if (isGitClone === true) {
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
    const curBranch = await getConfigBranch()
    const install = async (projects: Types.DProjectInConfChoice[]) => {
      const tasks = projects.map(({ name, workspace, repository }) => async () => {
        const wsFolder = path.join(process.cwd(), workspace)
        await fs.ensureDir(wsFolder)

        if (!(await gitClone(repository, wsFolder, name, curBranch))) {
          await gitClone(repository, wsFolder, name)
        }
      })

      if (tasks.length === 0) {
        return
      }

      if (options?.sequence) {
        await waterfall(tasks)
      }

      await Promise.all(tasks.map((exec) => exec()))
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

    await install(necessaries)

    if (optionals.length > 0) {
      if (yes) {
        if (optional) {
          await install(optionals)
        }
      } else {
        if (await confirm(i18n.COMMAND__BOOTSTRAP__CONFIRM_INSTALL_OPTIONAL``, false)) {
          const selectedProjects = await multiSelect('projectInConfig')(i18n.COMMAND__BOOTSTRAP__SELECT_CLONE_PROJECT``, optionals)
          await install(selectedProjects)
        }
      }
    }
  }

  if (yarnInstall === true) {
    if (yes || (await confirm(i18n.COMMAND__BOOTSTRAP__CONFIRM_INSTALL_DEPEDENCIES``))) {
      await spawn('yarn', [], { shell: true })
    }
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
