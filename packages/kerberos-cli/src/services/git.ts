import os from 'os'
import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'
import uniq from 'lodash/uniq'
import commandExists from 'command-exists'
import isGitUrl from 'is-git-url'
import { spawn, getStdout } from './process'

/**
 * 检测是否安装了GIT
 */
export async function supportedGit(): Promise<boolean> {
  return await promisify(commandExists)('git')
}

/**
 * 判断仓库是否干净
 * @param folder 文件名
 */
export async function isPristine(folder: string): Promise<boolean> {
  const message = await getStdout('git diff --name-only', { cwd: folder })
  return message.length === 0
}

/**
 * 判断GIT是否存在
 * @param folder 文件目录
 */
export async function exists(folder: string) {
  const gitFolder = path.join(folder, '.git')
  const gitExists = await fs.pathExists(gitFolder)
  return gitExists
}

/**
 * 克隆仓库
 * @param repo 仓库地址
 * @param name 名称
 * @param cwd 执行路径
 */
export async function gitClone(repo: string, name: string, folder: string): Promise<boolean> {
  if (!isGitUrl(repo)) {
    throw new Error('Repo is not a valid git url')
  }

  await fs.ensureDir(folder)

  const args = ['clone', repo, name]
  if (await spawn('git', args, { cwd: folder })) {
    return false
  }

  return await exists(path.join(folder, name))
}

/**
 * 获取GIT当前分支
 * @param cwd 执行路径
 */
export async function getBranch(folder: string): Promise<string> {
  const stdout = await getStdout('git branch --show-current', { cwd: folder })
  return stdout.split(os.EOL).shift()
}

/**
 * 获取GIT当前所有分支(包含远程)
 * @param folder 项目路径
 */
export async function getBranches(folder: string): Promise<{ locals: string[]; remotes: string[] }> {
  const stdout = await getStdout('git branch -a', { cwd: folder })
  const locals = []
  const remotes = []

  if (stdout) {
    const lines = stdout.trim().split(os.EOL)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim().replace(/^\*\s*/, '')
      if (/^remotes/.test(line)) {
        if (-1 === line.search('->')) {
          const [remote] = line.split(' -> ')
          remotes.push(remote)
        }
      } else {
        locals.push(line)
      }
    }
  }

  return { locals, remotes }
}

/**
 * 获取GIT当前所有分支名称(包含远程)
 * @param folder 项目路径
 */
export async function getBranchNames(folder: string): Promise<string[]> {
  const { remotes, locals } = await getBranches(folder)
  const branches = remotes.map((branch) => branch.split('/').slice(2).join('/'))
  return uniq([].concat(branches, locals))
}

/**
 * 获取GIT当前所有本地分支的关联(包含远程)
 * @param folder 项目路径
 */
export async function getBranchTracking(folder: string): Promise<{ [N: string]: string }> {
  const stdout = await getStdout('git branch -vv', { cwd: folder })
  const tracking = {}

  if (stdout) {
    const lines = stdout.trim().split(os.EOL)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim().replace(/^\*\s*/, '')
      const matched = /^(?:\*\s+)?([^\s]+?)\s+(?:[^\s]+?)\s+\[(.+?)\]/.exec(line)
      if (matched) {
        const [, local, remote] = matched
        tracking[local] = remote
      }
    }
  }

  return tracking
}