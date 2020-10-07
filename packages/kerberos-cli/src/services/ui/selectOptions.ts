import chalk from 'chalk'
import { getConfig, getWorkspaceInfoCollection, getProjectInfoCollection } from '../project'
import { getBranchNames, getBranchTracking } from '../git'
import { warn } from '../logger'
import { configFileName } from '../../constants/conf'
import i18n, { languages as Languages } from '../../i18n'
import * as Types from '../../types'
import * as I18nTypes from '../../i18n/types'

/** 获取工作区选项 */
export async function workspace(): Promise<Types.DWorkspaceChoice[]> {
  const workspaces = await getWorkspaceInfoCollection()
  if (!(Array.isArray(workspaces) && workspaces.length > 0)) {
    warn(i18n.UI_SELECT_OPTIONS__WORKSPACE__WARN_NOT_FOUND_WORKSPACE``)
    return null
  }

  return workspaces
}

/** 获取项目选项 */
export async function project(): Promise<Types.DProjectChoice[]> {
  const choices = await getProjectInfoCollection()
  if (!(Array.isArray(choices) && choices.length > 0)) {
    warn(i18n.UI_SELECT_OPTIONS__PROJECT__WARN_NOT_FOUND_PROJECT``)
    return null
  }

  return choices
}

/**
 * 获取分支选项
 * @param folder 文件夹
 */
export async function branch(folder: string): Promise<Types.DBranchChoice[]> {
  const branches = await getBranchNames(folder)
  const tracking = await getBranchTracking(folder)
  if (!(Array.isArray(branches) && branches.length > 0)) {
    warn(i18n.UI_SELECT_OPTIONS__BRANCH__WARN_NOT_FOUND_BRANCH``)
    return null
  }

  const choices = branches.map((value) => {
    const remote = tracking[value]
    const name = chalk.grey(remote ? `${chalk.cyan(value)} => ${chalk.white(remote)}` : `${chalk.white(value)}`)
    return { value, name }
  })

  return choices
}

/** 脚本 */
export async function script(scripts: { [name: string]: string }): Promise<Types.DScriptChoice[]> {
  return Object.keys(scripts).map((name) => {
    const command = scripts[name]
    return { name, command }
  })
}

/** 语言 */
export async function languages(): Promise<I18nTypes.DLanguageChoice[]> {
  return i18n.supported.map((value) => {
    const { alias: name } = Languages[value] || {}
    return { name, value }
  })
}

/** 获取项目选项(包含未初始化, 仅存在于配置中) */
export async function projectInConfig(projects?: Types.CProject[]): Promise<Types.DProjectInConfChoice[]> {
  const choices = projects || (await getConfig())?.projects || []
  if (!(Array.isArray(choices) && choices.length > 0)) {
    warn(i18n.UI_SELECT_OPTIONS__PROJECT_IN_CONFIG__WARN_NOT_FOUND_PROJECTS`${configFileName}`)
    return
  }

  return choices
}
