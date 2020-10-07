import fs from 'fs-extra'
import path from 'path'
import isGitUrl from 'is-git-url'
import { program } from 'commander'
import { gitClone } from '../services/git'
import { spawn } from '../services/process'
import { confirm } from '../services/ui'
import { success, info } from '../services/logger'
import intercept from '../interceptors'
import { configTemplate, configProjectFolderName, configFileName, packageFileName, defaultWorkspaceName } from '../constants/conf'
import i18n from '../i18n'

async function takeAction(folder: string, repo?: string): Promise<void> {
  /** 新执行环境 */
  const context = path.isAbsolute(folder) ? folder : path.join(process.cwd(), folder)
  if (await fs.pathExists(context)) {
    if (!(await fs.stat(context)).isDirectory()) {
      throw new Error(`${i18n.COMMAND__INIT__ERROR_INVALID_FOLDER}: ${context}`)
    }
  } else {
    await fs.ensureDir(context)
  }

  // 清除原有文件(默认不清除)
  if ((await fs.readdir(context)).length > 0) {
    if (await confirm(`${i18n.COMMAND__INIT__CONFIRM_CLEAN_MESSAGE} ${context}`, false)) {
      await fs.remove(context)
      await fs.ensureDir(context)
    } else {
      throw new Error(`${i18n.COMMAND__INIT__ERROR_EMPTY_FOLDER}: ${context}`)
    }
  }

  // 创建项目
  await fs.ensureDir(context)

  // 更改环境
  process.chdir(context)

  const defaultConfigFolder = path.join(context, defaultWorkspaceName, configProjectFolderName)
  const defaultConfigFile = path.join(defaultConfigFolder, configFileName)
  const defaultPackageFile = path.join(defaultConfigFolder, packageFileName)

  if (typeof repo === 'string') {
    if (!isGitUrl(repo)) {
      throw new Error(`${i18n.COMMAND__INIT__ERROR_INVALID_REPO}: ${repo}`)
    }

    if (!(await gitClone(repo, configProjectFolderName, path.join(context, defaultWorkspaceName)))) {
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
  await fs.symlink(defaultConfigFile, path.join(context, configFileName))
  await fs.symlink(defaultPackageFile, path.join(context, 'package.json'))

  success(i18n.COMMAND__INIT__SUCCESS_COMPLETE``)
  info(i18n.COMMAND__INIT__HELP_OPERATION`${folder}`)
}

program
  .command('init <folder> [repo]')
  .description(i18n.COMMAND__INIT__DESC``)
  .action((folder: string, repo?: string) => intercept(['tryAction', 'supported'])(takeAction)(folder, repo))
