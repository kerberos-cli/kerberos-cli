import path from 'path'
import fs from 'fs-extra'
import { promisify } from 'util'
import { glob } from 'glob'
import semver from 'semver'
import { flatten, uniq } from 'lodash'
import { isPristine, getBranch } from './git'
import { openJsonFile, updateJsonFile } from './fileMemory'
import { sequence } from '../utils/object'
import { configFileName } from '../constants/conf'
import { configKeySequence } from '../constants/project'
import * as Types from '../types'

/** 获取配置文件路径 */
export function getConfigPath(): string {
  return path.join(process.cwd(), configFileName)
}

/**
 * 读取配置文件信息
 * @param file 配置文件路径
 */
export async function getConfig(file: string = getConfigPath()): Promise<Types.CConfig> {
  const content = await openJsonFile(file)
  return content
}

/** 获取配置项目路径 */
export async function getConfigProjectPath(): Promise<string> {
  const cwd = process.cwd()
  const file = getConfigPath()
  const realpath = await fs.realpath(file)
  return path.relative(cwd, path.dirname(realpath))
}

/** 获取配置项目名称 */
export async function getConfigProjectName(): Promise<string> {
  const folder = await getConfigProjectPath()
  const { name } = (await openJsonFile(path.join(folder, 'package.json'))) || {}
  return name
}

/**
 * 获取配置项目分支
 * @param folder 项目目录
 */
export async function getConfigBranch(folder?: string) {
  const cfgFolder = folder || path.dirname(await fs.realpath(getConfigPath()))
  return getBranch(cfgFolder)
}

/**
 * 更新配置文件
 * @param options 配置信息
 * @param file 配置文件路径
 */
export async function updateConfig(options: Partial<Types.CConfig>, file: string = getConfigPath()): Promise<void> {
  const source = await getConfig(file)
  /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
  const workspaces = await getWorkspaceInfoCollection()
  const { version, projects } = options || {}
  if (version && semver.valid(version)) {
    source.version = version
  }

  if (Array.isArray(projects)) {
    source.projects = projects.filter((project) => {
      const { name, workspace } = project || {}
      if (!(typeof name === 'string' && name)) {
        return false
      }

      if (!(typeof workspace === 'string' && -1 !== workspaces.findIndex((item) => item.name === workspace))) {
        return false
      }

      return true
    })
  }

  const sortedSource = sequence(source, () => configKeySequence)
  await updateJsonFile(file, sortedSource)
}

/**
 * 为配置文件添加项目
 * @param projects 项目信息
 */
export async function addProjectsToConfig(projects: Types.CProject[]): Promise<void> {
  const source = await getConfig()
  const exists = source?.projects || []
  const addition = projects.filter(({ name }) => -1 === exists.findIndex((project) => project.name === name))
  const final = [].concat(exists, addition)
  await updateConfig({ projects: final })
}

/** 读取工作区 package.json 文件路径 */
export function getPackagePath(): string {
  return path.join(process.cwd(), 'package.json')
}

/**
 * 读取 package.json 文件信息
 * @param file 文件
 */
export async function getPackage(file: string = getPackagePath()): Promise<Types.CPackage> {
  const content = await openJsonFile(file)
  return content
}

/**
 * 更新 package.json 文件
 * @param options 配置信息
 * @param file 配置文件
 */
export async function updatePackage(options: Partial<Types.CPackage>, file: string = getConfigPath()) {
  const source = await getPackage(file)
  const keys = Object.keys(source)
  const { version } = options || {}
  if (version && semver.valid(version)) {
    source.version = version
  }

  /** 更新依赖中所有可能出现的版本 */
  const { dependencies, devDependencies, optionalDependencies, bundleDependencies, bundledDependencies } = options
  if (dependencies) {
    source.dependencies = dependencies
  }
  if (devDependencies) {
    source.devDependencies = devDependencies
  }
  if (optionalDependencies) {
    source.optionalDependencies = optionalDependencies
  }
  if (bundleDependencies) {
    source.bundleDependencies = bundleDependencies
  }
  if (bundledDependencies) {
    source.bundledDependencies = bundledDependencies
  }

  const sortedSource = sequence(source, () => keys)
  await updateJsonFile(file, sortedSource)
}

/**
 * 获取所有子项目 package.json 文件路径集合
 * @param specifyConfig 指定根配置配置
 */
export async function getPackagePathCollection(specifyConfig?: Types.CConfig): Promise<string[]> {
  const { workspaces } = specifyConfig || (await getConfig())
  if (!Array.isArray(workspaces)) {
    return []
  }

  const packages = await Promise.all(
    workspaces.map(async (pattern) => {
      const projectPattern = path.join(pattern, 'package.json')
      const files = await promisify(glob)(projectPattern, {
        ignore: ['node_modules'],
      })

      return files
    })
  )

  return uniq(flatten(packages))
}

/**
 * 获取子项目路径集合
 * @param specifyPackagePathCollection 指定子项目的 package.json 文件路径集合
 */
export async function getProjectPathCollection(specifyPackagePathCollection?: string[]): Promise<string[]> {
  const packages = specifyPackagePathCollection || (await getPackagePathCollection())
  const projects = packages.map((file) => path.dirname(file))
  return projects
}

/**
 * 获取子项目信息集合
 * @param specifyPackagePathCollection 指定子项目的 package.json 文件路径集合
 */
export async function getProjectInfoCollection(specifyPackagePathCollection?: string[]): Promise<Types.DProject[]> {
  const packages = specifyPackagePathCollection || (await getPackagePathCollection())
  return await Promise.all(
    packages.map(async (file) => {
      const abs = path.join(process.cwd(), file)
      const content = await openJsonFile(abs)
      const { name, version } = content
      const folder = path.dirname(abs)
      return { name, version, folder, package: content }
    })
  )
}

/**
 * 通过名称获取项目信息
 * @param name 项目名称
 * @param specifyProjectInfoCollection 指定子项目信息集合
 */
export async function getProjectInfoByName(name: string, specifyProjectInfoCollection?: Types.DProject[]): Promise<Types.DProject> {
  const collection = specifyProjectInfoCollection || (await getProjectInfoCollection())
  return collection.find((item) => item.name === name)
}

/**
 * 获取有未提交的项目路径集合
 * @param specifyProjectPathCollection 指定子项目的路径集合
 */
export async function getDirtyProjectPathCollection(specifyProjectPathCollection?: string[]): Promise<string[]> {
  const collection = specifyProjectPathCollection || (await getProjectPathCollection())
  const pristines = await Promise.all(
    collection.map(async (folder) => {
      const flag = await isPristine(folder)
      return flag ? true : folder
    })
  )

  const dirty = pristines.filter((flag) => flag !== true) as string[]
  return dirty
}

/**
 * 获取有未提交的项目路径集合
 * @param specifyDirtyProjectPathCollection 指定有未提交的项目路径集合
 */
export async function getDirtyProjectInfoCollection(specifyDirtyProjectPathCollection?: string[]): Promise<Types.DProject[]> {
  const collection = specifyDirtyProjectPathCollection || (await getDirtyProjectPathCollection())
  return Promise.all(
    collection.map(async (projectPath) => {
      const file = path.join(projectPath, 'package.json')
      const content = await openJsonFile(file)
      const { name, version } = content
      const folder = path.dirname(file)
      return { name, version, folder, package: content }
    })
  )
}

/**
 * 获取工作区路径集合
 * @param specifyProjectPathCollection 指定子项目的路径集合
 */
export async function getWorkspacePathCollection(specifyProjectPathCollection?: string[]): Promise<string[]> {
  const { workspaces } = await getConfig()
  if (!Array.isArray(workspaces)) {
    return []
  }

  const abstract = workspaces.map((pattern) => pattern.split('/').shift())
  const projects = specifyProjectPathCollection || (await getProjectPathCollection())
  const exists = projects.map((folder) => path.dirname(folder))
  return uniq([].concat(abstract, exists))
}

/**
 * 获取工作区信息集合
 * @param specifyWorkspacePathCollection 指定工作区路径集合
 */
export async function getWorkspaceInfoCollection(specifyWorkspacePathCollection?: string[]): Promise<Types.DWorkspace[]> {
  const workspaces = specifyWorkspacePathCollection || (await getWorkspacePathCollection())
  return workspaces.map((name) => {
    const folder = path.join(process.cwd(), name)
    return { name, folder }
  })
}

/**
 * 获取依赖图谱
 * @param specifyProjectInfoCollection 指定子项目信息集合
 */
export async function getDependencyGraph(specifyProjectInfoCollection?: Types.DProject[]): Promise<Types.FlattenDependencyList> {
  const collection = specifyProjectInfoCollection || (await getProjectInfoCollection())
  const names = collection.map(({ package: pkgJSON }) => pkgJSON.name)
  const graph = collection.map(({ package: pkgJSON }) => {
    const { name, dependencies: prodDependencies = {}, devDependencies = {}, optionalDependencies = {}, bundleDependencies = {}, bundledDependencies = {} } = pkgJSON

    const prod = Object.keys(prodDependencies)
    const dev = Object.keys(devDependencies)
    const optional = Object.keys(optionalDependencies)
    const bundle = Object.keys(bundleDependencies)
    const bundled = Object.keys(bundledDependencies)
    const dependencies: string[] = [].concat(prod, dev, optional, bundle, bundled).filter((name) => -1 !== names.indexOf(name))
    return { name, dependencies }
  })

  return graph
}
