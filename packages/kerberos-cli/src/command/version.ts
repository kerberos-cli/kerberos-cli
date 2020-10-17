import path from 'path'
import chalk from 'chalk'
import semver from 'semver'
import uniq from 'lodash/uniq'
import groupBy from 'lodash/groupBy'
import isGitUrl from 'is-git-url'
import { program } from 'commander'
import { getConfig, updateConfig, getDependencyGraph, getDirtyProjectInfoCollection, getProjectInfoCollection, updatePackage } from '../services/project'
import intercept from '../interceptors'
import { spawn } from '../services/process'
import { getBranch, getRemotes, isPristine } from '../services/git'
import { confirm, selectVersion } from '../services/ui'
import { openJsonFile } from '../services/fileMemory'
import { randomHex, warn } from '../services/logger'
import i18n from '../i18n'
import * as Types from '../types'

function updateVersion(curVer: string, version: string): string {
  if (isGitUrl(curVer)) {
    return curVer.replace(/\#.*$/g, '') + `#${version}`
  }

  return version
}

async function takeAction(version: string, options: Types.CLIVersionOptions = {}) {
  const configs = await getConfig()
  const curVer = configs.version || '1.0.0'

  // 若版本错误或没有输入, 则通过UI获取
  let finalVersion = version
  if (!semver.valid(version)) {
    finalVersion = await selectVersion(i18n.COMMAND__VERSION__INPUT_VERSION``, curVer)
  }

  // 选择项目
  const releaseBranch = configs?.release?.branch
  const projects = await getProjectInfoCollection()
  const branches = await Promise.all(
    projects.map(async (project) => {
      const { name, folder } = project
      const branch = await getBranch(folder)
      return { name, branch }
    })
  )

  // 检测是否文件改动未提交
  const dirtyProjects = await getDirtyProjectInfoCollection()
  if (dirtyProjects.length > 0 && -1 !== dirtyProjects.findIndex((item) => -1 !== projects.findIndex((project) => project.name === item.name))) {
    const names = dirtyProjects.map((item: { name: string; version: string; folder: string }) => item.name)
    throw new Error(i18n.COMMAND__VERSION__ERROR_NOT_SUBMIT`\n${names.map((name) => ` - ${name} `).join('  \n')}`)
  }

  // 配置发布分支, 检测分支是否都在发布分支
  if (releaseBranch) {
    const projects = branches.filter(({ branch }) => branch !== releaseBranch)
    if (projects.length > 0) {
      const message = i18n.COMMAND__VERSION__ERROR_RELEASE_BRANCH`${projects.map(({ name }) => chalk.white(name)).join(', ')} ${chalk.white(releaseBranch)}`
      throw new Error(message)
    }
  } else {
    // 检测是否都在相同的分支中
    const diff = uniq(branches.map((project) => project.branch))
    if (diff.length > 1) {
      const group = groupBy(branches, 'branch')
      const colors = {}
      Object.keys(group).forEach((branch) => (colors[branch] = randomHex()))

      const status = branches.map(({ name, branch }) => chalk.gray(` - ${chalk.white(name)} >> ${chalk.hex(colors[branch])(branch)}`)).join('\n')
      if (!(await confirm(i18n.COMMAND__VERSION__CONFIRM_DIFF_BRANCHES`${status}`))) {
        return
      }
    }
  }

  // 保证版本号比项目版本号要高
  const invalidProjects = projects.filter(({ version }) => semver.compare(finalVersion, version) < 0)
  if (invalidProjects.length > 0) {
    const message = invalidProjects.map(({ name, version }) => chalk.gray(` - ${chalk.white(name)}@${chalk.cyan(version)}`)).join('\n')
    throw new Error(i18n.COMMAND__VERSION__ERROR_VERSION`${message}`)
  }

  // 获取依赖
  const related = projects.map((item) => item.name)
  const graph = await getDependencyGraph()
  graph.forEach(({ dependencies }) => related.push(...dependencies))

  // 更新依赖
  const commitMessage = configs?.release?.message || 'chore(release): Kerberos Tag'
  const relatedProjects = uniq(related)
  const finalProjects = (await getProjectInfoCollection()).filter((item) => relatedProjects.indexOf(item.name) !== -1)
  await Promise.all(
    finalProjects.map(async ({ name, folder }) => {
      const { dependencies: deps = [] } = graph.find((item) => item.name === name) || {}
      const file = path.join(folder, 'package.json')
      const source: Types.CPackage = await openJsonFile(file)
      source.version = finalVersion

      /** 更新依赖中所有可能出现的版本 */
      const { dependencies, devDependencies, optionalDependencies, bundleDependencies, bundledDependencies } = source
      if (Array.isArray(deps) && deps.length > 0) {
        deps.forEach((name) => {
          if (dependencies?.[name]) {
            dependencies[name] = updateVersion(dependencies[name], finalVersion)
          }

          if (devDependencies?.[name]) {
            devDependencies[name] = updateVersion(devDependencies[name], finalVersion)
          }

          if (optionalDependencies?.[name]) {
            optionalDependencies[name] = updateVersion(optionalDependencies[name], finalVersion)
          }

          if (bundleDependencies?.[name]) {
            bundleDependencies[name] = updateVersion(bundleDependencies[name], finalVersion)
          }

          if (bundledDependencies?.[name]) {
            bundledDependencies[name] = updateVersion(bundledDependencies[name], finalVersion)
          }
        })
      }

      // 更新配置
      await updatePackage(source, file)
    })
  )

  // 更新工作区版本
  await updateConfig({ version: finalVersion })

  /** 提交代码 */
  await Promise.all(
    finalProjects.map(async ({ name, folder }) => {
      // 自动提交代码
      await spawn('git', ['add', '.'], { cwd: folder })
      await spawn('git', ['commit', '-m', commitMessage], { cwd: folder })
      if (!(await isPristine(folder))) {
        warn(i18n.COMMAND__VERSION__WARN_COMMIT_FAIL``)
        return
      }

      await spawn('git', ['tag', finalVersion], { cwd: folder })

      // 代码推送
      if (typeof options.noPush === 'undefined' || options.noPush !== false) {
        const remotes = await getRemotes(folder)
        const { name: remote } = remotes.find((item) => item.name === 'origin') || {}
        const { branch } = branches.find((item) => item.name === name) || {}
        if (!remote) {
          warn(i18n.COMMAND__VERSION__WARN_NO_REMOTE`${name}`)
          return
        }

        if (!branch || branch === 'HEAD') {
          warn(i18n.COMMAND__VERSION__WARN_NO_BRANCH`${name}`)
          return
        }

        await spawn('git', ['push', '--atomic', remote, branch, finalVersion], { cwd: folder })
      }
    })
  )
}

program
  .command('version [version]')
  .description(i18n.COMMAND__VERSION__DESC``, {
    version: i18n.COMMAND__VERSION__ARGS_VERSION``,
  })
  .option('--no-push', i18n.COMMAND__VERSION__OPTION_NO_PUSH``)
  .action((version: string, options: Types.CLIVersionOptions) => intercept()(takeAction)(version, options))
