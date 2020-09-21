import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'
import isGitUrl from 'is-git-url'
import { glob } from 'glob'
import flattenDeep from 'lodash/flattenDeep'
import { isPristine } from './git'
import { configFile } from '../constants/config'
import * as Types from '../types'

/** 读取配置文件信息 */
export async function getConfig(): Promise<Types.CCSettings> {
  const config = path.join(process.cwd(), configFile)
  const source = (await fs.readJSON(config)) || {}
  return source
}

/** 获取所有工作区信息 */
export async function getWorkspaces(): Promise<Types.CCWorkspace[]> {
  const { workspaces } = await getConfig()
  if (!Array.isArray(workspaces)) {
    return []
  }

  return workspaces.map(item => {
    const name = path.dirname(item)
    const folder = path.join(process.cwd(), name)
    return { name, folder }
  })
}

/**
 * 获取工作区信息
 * @param name 工作区名称
 */
export async function getWorkspace(name: string): Promise<Types.CCWorkspace> {
  const { workspaces } = await getConfig()
  if (!Array.isArray(workspaces)) {
    return null
  }

  const names = workspaces.map(pattern => path.dirname(pattern))
  if (-1 === names.indexOf(name)) {
    return null
  }

  const folder = path.join(process.cwd(), name)
  return { name, folder }
}

/** 获取所有的工作区 */
export async function getFoldersInWorkspace(): Promise<string[]> {
  const { workspaces } = await getConfig()
  if (!Array.isArray(workspaces)) {
    return []
  }

  const promises = workspaces.map(async workspacePattern => {
    const pattern = path.join(process.cwd(), workspacePattern)
    const folders = await promisify(glob)(pattern)
    return folders
  })

  const results = await Promise.all(promises)
  return flattenDeep(results)
}

/**
 * 获取所有 Packages
 * @param filters 过滤项目名
 */
export async function getProjects(filters?: string[]): Promise<Types.CCProject[]> {
  const workspaces = await getFoldersInWorkspace()
  const projects = await Promise.all(
    workspaces.map(async folder => {
      const file = path.join(folder, 'package.json')
      if (await fs.pathExists(file)) {
        const { name, version, scripts } = await fs.readJSON(file)
        return { name, version, folder, scripts }
      }
    })
  )

  if (Array.isArray(filters) && filters.length > 0) {
    return projects.filter(item => -1 !== filters.indexOf(item.name))
  }

  return projects
}

/**
 * 根据名称获取Package
 * @param name 项目名称
 */
export async function getProject(name: string): Promise<Types.CCProject> {
  const projects = await getProjects()
  return projects.find(item => item.name === name)
}

/** 获取有未提交的项目 */
export async function getDirtyProjects(): Promise<Types.CCProject[]> {
  const projects = await getProjects()
  const promises = projects.map(async item => ((await isPristine(item.folder)) ? true : item))
  const pristines = await Promise.all(promises)
  const dirty = pristines.filter(flag => flag !== true)
  return dirty as Types.CCProject[]
}

/**
 * 添加项目
 * @param projects 项目信息
 */
export async function addProjects(projects: Types.CCSettingProject[]): Promise<void> {
  const config = path.join(process.cwd(), configFile)
  const source = await getConfig()
  const workspaces = await getWorkspaces()

  const finalProjects = source.projects || []
  projects.forEach(project => {
    const { name, repository, workspace } = project || {}

    if (!(typeof name === 'string' && name)) {
      return
    }

    if (!(typeof repository === 'string' && isGitUrl(repository))) {
      return
    }

    if (!(typeof workspace === 'string' && -1 !== workspaces.findIndex(item => item.name === workspace))) {
      return
    }

    finalProjects.push(project)
  })

  source.projects = finalProjects
  await fs.writeFile(config, JSON.stringify(source, null, 2))
}
