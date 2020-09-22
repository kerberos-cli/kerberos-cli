import fs from 'fs-extra'
import path from 'path'
import isGitUrl from 'is-git-url'
import { program } from 'commander'
import { gitClone } from '../services/git'
import { spawn } from '../services/process'
import { confirm } from '../services/ui'
import { success, info } from '../services/logger'
import intercept from '../interceptors'
import { cerberusTemplate, configTemplate, configProjectFolderName, configFile } from '../constants/config'

async function takeAction(folder: string, repo?: string): Promise<void> {
  /** 新执行环境 */
  const context = path.isAbsolute(folder) ? folder : path.join(process.cwd(), folder)
  if (await fs.pathExists(context)) {
    if (!(await fs.stat(context)).isDirectory()) {
      throw new Error(`File ${context} is not a directory.`)
    }
  } else {
    await fs.ensureDir(context)
  }

  // 清除原有文件(默认不清除)
  if ((await fs.readdir(context)).length > 0) {
    if (await confirm(`Folder ${context} is not empty, can I clean it up for you?`, false)) {
      await fs.remove(context)
      await fs.ensureDir(context)
    } else {
      throw new Error(`Folder ${context} is not empty.`)
    }
  }

  // 创建项目
  await fs.copy(cerberusTemplate, context)

  // 更改环境
  process.chdir(context)

  const defaultConfigFolder = path.join(context, '@kerberos', configProjectFolderName)
  const defaultConfigFile = path.join(defaultConfigFolder, configFile)

  if (typeof repo === 'string') {
    if (!isGitUrl(repo)) {
      throw new Error(`Repo is invalid: ${repo}`)
    }

    if (!(await gitClone(repo, configProjectFolderName, path.join(context, '@kerberos')))) {
      throw new Error(`Git clone failed: ${repo}`)
    }

    if (!(await fs.pathExists(defaultConfigFile))) {
      throw new Error('Project is invalid: can not found kerberos.json file.')
    }

    await fs.symlink(defaultConfigFile, path.join(context, configFile))
  } else {
    if (await confirm('Can I create a new kerberos configuration project?')) {
      await fs.ensureDir(defaultConfigFolder)
      await fs.copy(configTemplate, defaultConfigFolder)
      await fs.symlink(defaultConfigFile, path.join(context, configFile))

      if (!(await spawn('git', ['init'], { cwd: defaultConfigFolder }))) {
        success('The generation of the kerberos configuration project has been completed.')
      }
    }
  }

  success('The initial setup of the kerberos workspace has been completed.')
  info(`Press <cd ${folder}> and enter the workspace.`)
}

program
  .command('init <folder> [repo]')
  .description('initialize kerberos workspace')
  .action((folder: string, repo?: string) => intercept(['tryAction', 'supported'])(takeAction)(folder, repo))
