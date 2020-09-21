import chalk from 'chalk'
import { getConfig, getWorkspaces, getProjects } from '../project'
import { getBranchNames, getBranchTracking } from '../git'
import { warn } from '../logger'
import { configFile } from '../../constants/config'
import * as Types from '../../types'

type Choices = Array<{
  name: string
  value?: any
  [N: string]: any
}>

/** 获取工作区选项 */
export async function workspace(workspaces?: Types.CCWorkspace[]): Promise<Types.CCWorkspace[]> {
  const choices = workspaces || (await getWorkspaces())
  if (!(Array.isArray(choices) && choices.length > 0)) {
    warn('No workspace found.')
    return null
  }

  return choices
}

/** 获取项目选项 */
export async function project(projects?: Types.CCProject[]): Promise<Types.CCProject[]> {
  const choices = projects || (await getProjects())
  if (!(Array.isArray(choices) && choices.length > 0)) {
    warn('No project found.')
    return null
  }

  return choices
}

/** 获取分支选项 */
export async function branch(folder: string): Promise<Choices> {
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

/** 获取项目选项(包含未初始化, 仅存在于配置中) */
export async function projectInConfig(projects?: Types.CCSettingProject[]): Promise<Types.CCSettingProject[]> {
  const choices = projects || (await getConfig())?.projects || []
  if (!(Array.isArray(choices) && choices.length > 0)) {
    warn(`No projects found in ${configFile}.`)
    return
  }

  return choices
}
