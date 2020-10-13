import os from 'os'
import { promisify } from 'util'
import { uniq, flatten } from 'lodash'
import commandExists from 'command-exists'
import { getStdout } from './process'
import * as Types from '../types'

/** 判断是否支持 YARN */
export async function supportedYarn(): Promise<boolean> {
  return await promisify(commandExists)('yarn')
}

/** 获取 Yarn 版本 */
export async function getYarnVersion(): Promise<string> {
  if (!(await supportedYarn())) {
    return ''
  }

  const stdout = await getStdout('yarn --version')
  if (stdout) {
    const [version] = stdout.trim().split(os.EOL)
    return version
  }

  return ''
}

/**
 * 获取依赖路径
 * @param name 名称(唯一)
 * @param names 名称列表(临时)
 * @param flattenList 依赖对应列表(一维数组)
 * @param paths 依赖路径集合
 * @description
 * a -> b
 * b -> c
 * a -> c
 * 可以得到 [[c, b, a], [c, a]]
 */
export function getDependencyPath(name: string, names: string[], flattenList: Types.FlattenDependencyList = [], paths: string[][] = []) {
  const curr = flattenList.find((item) => item.name === name)
  if (!curr) {
    return paths
  }

  const { name: cName, dependencies } = curr
  names.push(cName)

  if (Array.isArray(dependencies) && dependencies.length > 0) {
    dependencies.forEach((name) => getDependencyPath(name, [...names], flattenList, paths))
    return paths
  }

  paths.push(names.reverse())
  return paths
}

/**
 * 获取依赖权重
 * @param list 依赖对应列表(一维数组)
 * @description
 * 根据依赖路径选出权重
 * [[c, b, a], [c, a]]
 * 可以得到 [{a:2}, {d:1}, {c:0}]
 */
export function getDependencyWeight(list: Types.FlattenDependencyList = []) {
  const paths = list.map((item) => getDependencyPath(item.name, [], list))
  const flattenPaths = flatten(paths)

  const reducer = (name: string) => (max: number, dependencies: string[]) => {
    const value = dependencies.indexOf(name)
    return max > value ? max : value
  }

  return list.map(({ name }) => {
    const weight = flattenPaths.reduce(reducer(name), -1)
    return { name, weight }
  })
}

/** 获取依赖 */
export function getDependencies(source: Types.CPackage): string[] {
  const { dependencies = {}, devDependencies = {}, optionalDependencies = {}, bundleDependencies = {}, bundledDependencies = {} } = source

  const prod = Object.keys(dependencies)
  const dev = Object.keys(devDependencies)
  const optional = Object.keys(optionalDependencies)
  const bundle = Object.keys(bundleDependencies)
  const bundled = Object.keys(bundledDependencies)
  return uniq([].concat(prod, dev, optional, bundle, bundled))
}
