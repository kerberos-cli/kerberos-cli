import fs from 'fs-extra'
import path from 'path'
import isGitUrl from 'is-git-url'
import { program } from 'commander'
import { openJsonFile } from '../services/fileMemory'
import { spawn } from '../services/process'
import { gitClone } from '../services/git'
import { confirm } from '../services/ui'
import { success, warn, info } from '../services/logger'
import { isWindows } from '../utils/os'
import intercept from '../interceptors'
import { configTemplate, configProjectFolderName, configFileName, workspacePackageFileName, workspaceDefaultName } from '../constants/conf'
import i18n from '../i18n'
import * as Types from '../types'

export async function linkFile(target: string, linkPath: string) {
  const folder = path.dirname(linkPath)
  await fs.ensureDir(folder)

  if (isWindows()) {
    // 因为 Windows 下创建文件软链需要管理员权限，
    // 而这里创建的软链均与Git无直接关系，
    // 主要给予本地使用，
    // 因此可以极大限度创建超链接，
    // 软链失败则尝试硬链。
    try {
      await fs.symlink(target, linkPath, 'file')
    } catch (error) {
      await fs.link(target, linkPath)
    }
  } else {
    await fs.symlink(target, linkPath)
  }
}

async function isDogeProject(folder: string): Promise<boolean> {
  const cfg = path.join(folder, configFileName)
  const pkg = path.join(folder, 'package.json')
  const wkg = path.join(folder, workspacePackageFileName)
  return (await fs.pathExists(cfg)) && (await fs.pathExists(pkg)) && (await fs.pathExists(wkg))
}

async function isKerberosProject(folder: string): Promise<boolean> {
  const cfg = path.join(folder, configFileName)
  const pkg = path.join(folder, 'package.json')
  if ((await fs.pathExists(cfg)) && (await fs.pathExists(pkg))) {
    if ((await fs.lstat(cfg)).isSymbolicLink() && (await fs.lstat(pkg)).isSymbolicLink()) {
      return true
    }
  }

  return false
}

async function ensureContext(folder: string): Promise<string> {
  const context = path.isAbsolute(folder) ? folder : path.join(process.cwd(), folder)
  if (await fs.pathExists(context)) {
    if (!(await fs.stat(context)).isDirectory()) {
      throw new Error(`${i18n.COMMAND__INIT__ERROR_INVALID_FOLDER}: ${context}`)
    }
  } else {
    await fs.ensureDir(context)
  }

  return context
}

async function dogeInit(folder: string): Promise<void> {
  const cfg = path.join(folder, configFileName)
  const pkg = path.join(folder, 'package.json')

  if (!(await fs.pathExists(cfg)) || (await fs.lstat(cfg)).isSymbolicLink()) {
    throw new Error(i18n.COMMAND__INIT__ERROR_SOFT_LINK`${configFileName}`)
  }

  if (!(await fs.pathExists(pkg))) {
    throw new Error(i18n.COMMAND__INIT__ERROR_NO_PACKAGE``)
  }

  const cfgJson: Types.CConfig = await openJsonFile(cfg)
  const pkgJson: Types.CPackage = await openJsonFile(pkg)
  const project = cfgJson.projects.find((item) => item.name === pkgJson.name)
  if (!project) {
    throw new Error(i18n.COMMAND__INIT__ERROR_NO_SETTINGS`${configFileName}`)
  }

  const { workspace } = project || {}
  if (!(typeof workspace === 'string' && workspace.length > 0)) {
    throw new Error(i18n.COMMAND__INIT__ERROR_INVALID_SETTINGS`${configFileName}`)
  }

  if (!(await confirm(i18n.COMMAND__INIT__CONFIRM_MOVE_FILES``))) {
    return
  }

  // 移动文件
  const files = (await fs.readdir(folder)).filter((file) => {
    const relative = path.relative(folder, file)
    return !/node_modules/.test(relative)
  })

  const dest = path.join(folder, workspace, configProjectFolderName)
  await fs.ensureDir(path.dirname(dest))

  /**
   * 若 process.cwd() 不在该目录下,
   * 移动文件时可能会报: 找不到 .git 文件错误
   */
  await Promise.all(
    files.map((file) => {
      const name = path.basename(file)
      const target = path.join(dest, name)
      return fs.move(file, target)
    })
  )

  // 创建配置软链
  await linkFile(path.join(dest, configFileName), path.join(folder, configFileName))
  await linkFile(path.join(dest, workspacePackageFileName), path.join(folder, 'package.json'))

  success(i18n.COMMAND__INIT__SUCCESS_COMPLETE``)
  info(i18n.COMMAND__INIT__HELP_OPERATION`${folder}`)
}

async function emptyInit(folder: string, repo?: string): Promise<void> {
  // 清除原有文件(默认不清除)
  if ((await fs.readdir(folder)).length > 0) {
    if (await confirm(`${i18n.COMMAND__INIT__CONFIRM_CLEAN_MESSAGE} ${folder}`, false)) {
      await fs.remove(folder)
      await fs.ensureDir(folder)
    } else {
      throw new Error(`${i18n.COMMAND__INIT__ERROR_EMPTY_FOLDER}: ${folder}`)
    }
  }

  // 创建项目
  await fs.ensureDir(folder)

  const defaultConfigFolder = path.join(folder, workspaceDefaultName, configProjectFolderName)
  const defaultConfigFile = path.join(defaultConfigFolder, configFileName)
  const defaultPackageFile = path.join(defaultConfigFolder, workspacePackageFileName)

  if (typeof repo === 'string') {
    if (!isGitUrl(repo)) {
      throw new Error(`${i18n.COMMAND__INIT__ERROR_INVALID_REPO}: ${repo}`)
    }

    if (!(await gitClone(repo, path.join(folder, workspaceDefaultName), configProjectFolderName))) {
      throw new Error(`${i18n.COMMAND__INIT__ERROR_FAIL_CLONE}: ${repo}`)
    }

    if (!(await fs.pathExists(defaultConfigFile))) {
      throw new Error(i18n.COMMAND__INIT__ERROR_NOT_FOUND_CONFIG_FILE``)
    }
  } else {
    // 自动创建配置项目
    if (await confirm(i18n.COMMAND__INIT__CONFIRM_CREATE_CONFIG_PROJECT``)) {
      await fs.ensureDir(defaultConfigFolder)
      await fs.copy(configTemplate, defaultConfigFolder)

      if (!(await spawn('git', ['init'], { cwd: defaultConfigFolder }))) {
        success(i18n.COMMAND__INIT__SUCCESS_INIT_GIT``)
      }
    }
  }

  // 添加软链到外层
  await linkFile(defaultConfigFile, path.join(folder, configFileName))
  await linkFile(defaultPackageFile, path.join(folder, 'package.json'))

  success(i18n.COMMAND__INIT__SUCCESS_COMPLETE``)
  info(i18n.COMMAND__INIT__HELP_OPERATION`${folder}`)
}

async function takeAction(folder: string, repo?: string): Promise<void> {
  if (await isKerberosProject(folder)) {
    warn(i18n.COMMAND__INIT__WARN_IS_KBPROJECT``)
    return
  }

  const context = await ensureContext(folder)
  process.chdir(context)

  if (await isDogeProject(context)) {
    await dogeInit(context)
  } else {
    await emptyInit(context, repo)
  }
}

program
  .command('init <folder> [repo]')
  .description(i18n.COMMAND__INIT__DESC``, {
    folder: i18n.COMMAND__INIT__ARGS_FOLDER``,
    repo: i18n.COMMAND__INIT__ARGS_REPO``,
  })
  .action((folder: string, repo?: string) => intercept(['tryAction', 'supported'])(takeAction)(folder, repo))
