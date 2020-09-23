import chalk from 'chalk'
import { getConfigInfo, getWorkspaceInfoCollection, getProjectInfoCollection } from '../project'
import { getBranchNames, getBranchTracking } from '../git'
import { warn } from '../logger'
import { configFileName } from '../../constants/config'
import * as Types from '../../types'

/** 获取工作区选项 */
export async function workspace(): Promise<Types.DWorkspaceChoice[]> {
  const workspaces = await getWorkspaceInfoCollection()
  if (!(Array.isArray(workspaces) && workspaces.length > 0)) {
    warn('No workspace found.')
    return null
  }

  return workspaces
}

/** 获取项目选项 */
export async function project(): Promise<Types.DProjectChoice[]> {
  const choices = await getProjectInfoCollection()
  if (!(Array.isArray(choices) && choices.length > 0)) {
    warn('No project found.')
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
    warn('No branches found.')
    return null
  }

  const choices = branches.map(value => {
    const remote = tracking[value]
    const name = chalk.grey(remote ? `${chalk.cyan(value)} => ${chalk.white(remote)}` : `${chalk.white(value)}`)
    return { value, name }
  })

  return choices
}

/** 脚本 */
export async function script(scripts: { [name: string]: string }): Promise<Types.DScriptChoice[]> {
  return Object.keys(scripts).map(name => {
    const command = scripts[name]
    return { name, command }
  })
}

/** 获取项目选项(包含未初始化, 仅存在于配置中) */
export async function projectInConfig(projects?: Types.CProject[]): Promise<Types.DProjectInConfChoice[]> {
  const choices = projects || (await getConfigInfo())?.projects || []
  if (!(Array.isArray(choices) && choices.length > 0)) {
    warn(`No projects found in ${configFileName}.`)
    return
  }

  return choices
}
