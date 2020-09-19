import inquirer from 'inquirer'
import chalk from 'chalk'
import { getConfig, getProjects, getWorkspaces } from './project'
import { warn } from '../services/logger'
import { getBranchNames, getBranchTracking } from './git'
import { configFile } from '../constants/config'
import * as Types from '../types'

/**
 * 确认提示
 * @param message 确认信息
 * @param defaultValue 默认值
 */
export async function confirm(message: string = 'Are you sure?', defaultValue: boolean = true): Promise<boolean> {
  const { value: selected } = await inquirer.prompt({
    type: 'confirm',
    name: 'value',
    message: message,
    default: defaultValue,
  })

  return selected
}

/**
 * 选择工作区
 * @param message 提示信息
 */
export async function selectWorkspace(message: string = 'Please select a workspace.'): Promise<Types.CCWorkspace> {
  const workspaces = await getWorkspaces()
  if (!(Array.isArray(workspaces) && workspaces.length > 0)) {
    warn('No workspaces found.')
    return null
  }

  const selectOptions = workspaces.map(({ name, folder }, index) => ({ name, folder, value: index }))
  const { value: selected } = await inquirer.prompt({
    type: 'search-list' as 'list',
    name: 'value',
    message: message,
    choices: selectOptions,
  })

  return workspaces[selected]
}

/**
 * 选择配置项中的项目(单选)
 * @param message 提示信息
 */
export async function selectConfigProject(message: string = 'Please select a project.', projects?: Types.CCSettingProject[]): Promise<Types.CCSettingProject> {
  const options = projects || (await getConfig())?.projects || []
  if (!(Array.isArray(options) && options.length > 0)) {
    warn(`No projects found in ${configFile}.`)
    return
  }

  const { value: selected } = await inquirer.prompt({
    type: 'search-list' as 'list',
    name: 'value',
    message: message,
    choices: options,
  })

  return options.find(item => item.name === selected)
}

/**
 * 选择配置项中的项目(多选)
 * @param message 提示信息
 */
export async function selectConfigProjects(message: string = 'Please select a project.', projects?: Types.CCSettingProject[]): Promise<Types.CCSettingProject[]> {
  const options = projects || (await getConfig())?.projects || []
  if (!(Array.isArray(options) && options.length > 0)) {
    warn(`No projects found in ${configFile}.`)
    return
  }

  const { value: selected } = await inquirer.prompt({
    type: 'search-checkbox' as 'checkbox',
    name: 'value',
    message: message,
    choices: options,
  })

  return selected.map((name: string) => options.find(item => item.name === name))
}

/**
 * 选择项目(单选)
 * @param message 提示信息
 */
export async function selectProject(message: string = 'Please select a project.', projects?: Types.CCProject[]): Promise<Types.CCProject> {
  const options = projects || (await getProjects())
  if (!(Array.isArray(options) && options.length > 0)) {
    warn('No projects found.')
    return
  }

  const { value: selected } = await inquirer.prompt({
    type: 'search-list' as 'list',
    name: 'value',
    message: message,
    choices: options,
  })

  return options.find(item => item.name === selected)
}

/**
 * 选择项目(多选)
 * @param message 提示信息
 */
export async function selectProjects(message: string = 'Please select any projects.', projects?: Types.CCProject[]): Promise<Types.CCProject[]> {
  const options = projects || (await getProjects())
  if (!(Array.isArray(options) && options.length > 0)) {
    warn('No projects found.')
    return
  }

  const { value: selected } = await inquirer.prompt({
    type: 'search-checkbox' as 'checkbox',
    name: 'value',
    message: message,
    choices: options,
  })

  return selected.map((name: string) => options.find(item => item.name === name))
}

/**
 * 选择分支(单选)
 * @param message 提示信息
 * @param folder 文件夹路径
 */
export async function selectBranch(message: string = 'Please select a branch.', folder: string): Promise<string> {
  const branches = await getBranchNames(folder)
  const tracking = await getBranchTracking(folder)
  if (!(Array.isArray(branches) && branches.length > 0)) {
    warn('No branches found.')
    return
  }

  const selectOptions = branches.map(value => {
    const remote = tracking[value]
    const name = chalk.grey(remote ? `${chalk.cyan(value)} => ${chalk.white(remote)}` : `${chalk.white(value)}`)
    return { value, name }
  })

  const { value: selected } = await inquirer.prompt({
    type: 'search-list' as 'list',
    name: 'value',
    message: message,
    choices: selectOptions,
  })

  return selected
}
