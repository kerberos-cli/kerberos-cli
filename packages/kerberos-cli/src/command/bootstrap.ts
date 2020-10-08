import fs from 'fs-extra'
import path from 'path'
import { program } from 'commander'
import { getConfig, getProjectInfoCollection } from '../services/project'
import { spawn } from '../services/process'
import { success } from '../services/logger'
import { confirm, multiSelect } from '../services/ui'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(options?: Types.CLIBootstrapOptions): Promise<void> {
  const { yes, optional } = options
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
  const install = (projects: Types.DProjectInConfChoice[]) => {
    return projects.map(({ name, workspace, repository }) => {
      const wsFolder = path.join(process.cwd(), workspace)
      return spawn('git', ['clone', repository, name], { cwd: wsFolder })
    })
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
  const nCodes = await Promise.all(install(necessaries))
  codes.push(...nCodes)

  if (optionals.length > 0) {
    if (yes) {
      if (optional) {
        const oCodes = await Promise.all(install(optionals))
        codes.push(...oCodes)
      }
    } else {
      if (await confirm(i18n.COMMAND__BOOTSTRAP__CONFIRM_INSTALL_OPTIONAL``, false)) {
        const selectedProjects = await multiSelect('projectInConfig')(i18n.COMMAND__BOOTSTRAP__SELECT_CLONE_PROJECT``, optionals)
        const oCodes = await Promise.all(install(selectedProjects))
        codes.push(...oCodes)
      }
    }
  }

  if (await confirm(i18n.COMMAND__BOOTSTRAP__CONFIRM_INSTALL_DEPEDENCIES``)) {
    await spawn('yarn')
  }

  success(i18n.COMMAND__BOOTSTRAP__SUCCESS_COMPLETE``)
}

program
  .command('bootstrap')
  .description(i18n.COMMAND__BOOTSTRAP__DESC``)
  .option('-y, --yes', i18n.COMMAND__BOOTSTRAP__OPTION_YES``)
  .option('-o, --optional', i18n.COMMAND__BOOTSTRAP__OPTION_OPTIONAL``)
  .action((options: Types.CLIBootstrapOptions) => intercept()(takeAction)(options))
