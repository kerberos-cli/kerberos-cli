import fs from 'fs-extra'
import path from 'path'
import { program } from 'commander'
import waterfall from 'promise-waterfall'
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
  const install = async (projects: Types.DProjectInConfChoice[]) => {
    const codes = []
    const tasks = projects.map(({ name, workspace, repository }) => async () => {
      const wsFolder = path.join(process.cwd(), workspace)
      await fs.ensureDir(wsFolder)

      const code = await spawn('git', ['clone', repository, name], { cwd: wsFolder })
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

  if (yes || (await confirm(i18n.COMMAND__BOOTSTRAP__CONFIRM_INSTALL_DEPEDENCIES``))) {
    await spawn('yarn', [], { shell: true })
  }

  /**
   * 在 Yarn Workspace 中,
   * 如果 package 存在 postinstall 脚本,
   * 则会出现依赖不使用软链而安装到里面的情况,
   * 但 workspace 根目录仍然拥有子项目的软链,
   * 因此这里需要确保依赖都是顶级, 而删除子项目中
   * 所有引用到 workspace 中已经存在的子项目.
   */
  const projectInfo = await getProjectInfoCollection()
  await Promise.all(
    projectInfo.map(async ({ name, folder }) => {
      const softlink = path.join(process.cwd(), 'node_modules', name)
      if (!(await fs.pathExists(softlink))) {
        await fs.link(folder, softlink)
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

  success(i18n.COMMAND__BOOTSTRAP__SUCCESS_COMPLETE``)
}

program
  .command('bootstrap')
  .description(i18n.COMMAND__BOOTSTRAP__DESC``)
  .option('--only-install')
  .option('-y, --yes', i18n.COMMAND__BOOTSTRAP__OPTION_YES``)
  .option('-o, --optional', i18n.COMMAND__BOOTSTRAP__OPTION_OPTIONAL``)
  .option('-S, --sequence', i18n.COMMAND__BOOTSTRAP__OPTION_SEQUENCE``)
  .action((options: Types.CLIBootstrapOptions) => intercept()(takeAction)(options))
