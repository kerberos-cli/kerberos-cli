import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'
import { flatten, uniq } from 'lodash'
import isGitUrl from 'is-git-url'
import { glob } from 'glob'
import { isPristine } from '../services/git'
import { configFile } from '../constants/config'
import * as Types from '../types'

/** 读取配置文件信息 */
export async function getConfig(): Promise<Types.CConfig> {
  const config = path.join(process.cwd(), configFile)
  const source = (await fs.readJSON(config)) || {}
  return source
}

/** 获取 package.json 文件路径集合 */
export async function getPackagePathCollection(): Promise<string[]> {
  const { workspaces } = await getConfig()
  if (!Array.isArray(workspaces)) {
    return []
  }

  const packages = await Promise.all(
    workspaces.map(async pattern => {
      const projectPattern = path.join(pattern, 'package.json')
      return await promisify(glob)(projectPattern, {
        ignore: ['node_modules'],
      })
    })
  )

  return flatten(packages)
}

/** 获取项目路径集合 */
export async function getProjectPathCollection(): Promise<string[]> {
  const packages = await getPackagePathCollection()
  const projects = packages.map(file => path.dirname(file))
  return projects
}

/** 获取有未提交的项目路径集合 */
export async function getDirtyProjectPathCollection(): Promise<string[]> {
  const collection = await getProjectPathCollection()
  const pristines = await Promise.all(
    collection.map(async folder => {
      const flag = await isPristine(folder)
      return flag ? true : folder
    })
  )

  const dirty = pristines.filter(flag => flag !== true) as string[]
  return dirty
}

/** 获取工作区路径集合 */
export async function getWorkspacePathCollection(): Promise<string[]> {
  const projects = await getProjectPathCollection()
  const workspaces = projects.map(folder => path.dirname(folder))
  return uniq(workspaces)
}

/** 获取项目信息集合 */
export async function getProjectInfoCollection(): Promise<Types.DProject[]> {
  const packages = await getPackagePathCollection()
  return await Promise.all(
    packages.map(async file => {
      const abs = path.join(process.cwd(), file)
      const source = (await fs.readJSON(abs)) || {}
      const { name, version } = source
      const folder = path.dirname(abs)
      return { name, version, folder, package: source }
    })
  )
}

/** 通过名称获取项目信息 */
export async function getProjectInfoByName(name: string): Promise<Types.DProject> {
  const collection = await getProjectInfoCollection()
  return collection.find(item => item.name === name)
}

/** 获取有未提交的项目路径集合 */
export async function getDirtyProjectInfoCollection(): Promise<Types.DProject[]> {
  const collection = await getDirtyProjectPathCollection()
  return Promise.all(
    collection.map(async pFolder => {
      const file = path.join(pFolder, 'package.json')
      const source = (await fs.readJSON(file)) || {}
      const { name, version } = source
      const folder = path.dirname(file)
      return { name, version, folder, package: source }
    })
  )
}

/** 获取工作区信息集合 */
export async function getWorkspaceInfoCollection(): Promise<Types.DWorkspace[]> {
  const workspaces = await getWorkspacePathCollection()
  return workspaces.map(name => {
    const folder = path.join(process.cwd(), name)
    return { name, folder }
  })
}

/**
 * 添加项目
 * @param projects 项目信息
 */
export async function addProjects(projects: Types.CProject[]): Promise<void> {
  const config = path.join(process.cwd(), configFile)
  const source = await getConfig()
  const workspaces = await getWorkspaceInfoCollection()

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
