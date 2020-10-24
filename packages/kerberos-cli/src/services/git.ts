import os from 'os'
import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'
import isGitUrl from 'is-git-url'
import uniq from 'lodash/uniq'
import commandExists from 'command-exists'
import { spawn, getStdout } from './process'

/**
 * 检测是否安装了GIT
 */
export async function supportedGit(): Promise<boolean> {
  return await promisify(commandExists)('git')
}

/** 获取 Git 版本 */
export async function getGitVersion(): Promise<string> {
  if (!(await supportedGit())) {
    return ''
  }

  const stdout = await getStdout('git --version')
  if (stdout) {
    const [line] = stdout.trim().split(os.EOL)
    const [, version] = line.match(/^git\s+version\s+(.+?)\s\((?:.+?)\)$/)
    return version
  }

  return ''
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
export async function gitClone(repo: string, folder: string, name: string, branch?: string): Promise<boolean> {
  if (!isGitUrl(repo)) {
    throw new Error('Repo is not a valid git url')
  }

  await fs.ensureDir(folder)

  const params = ['clone', repo, path.basename(name)]
  branch && params.push('-b', branch)

  if (await spawn('git', params, { cwd: folder })) {
    return false
  }

  return await exists(path.join(folder, name))
}

/**
 * 切换分支
 * @param branch 分支名称
 * @param folder 目录路径
 */
export async function gitCheckout(branch: string, folder: string): Promise<boolean> {
  /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
  const { locals, remotes } = await getBranches(folder)
  const remoteBranches = remotes.map((branch) => branch.replace(/remotes\/[\w\W]+?\//, ''))
  const params = ['checkout']
  if (locals.indexOf(branch) === -1) {
    if (remoteBranches.indexOf(branch) === -1) {
      params.push('-b', branch)
    } else {
      params.push('--track', `origin/${branch}`)
    }
  } else {
    params.push(branch)
  }

  if (await spawn('git', params, { cwd: folder })) {
    return false
  }

  return true
}

/**
 * 获取GIT当前分支
 * @param cwd 执行路径
 */
export async function getBranch(folder: string): Promise<string> {
  await spawn('git', ['fetch'], { cwd: folder })
  try {
    const stdout = await getStdout('git rev-parse --abbrev-ref HEAD', { cwd: folder })
    return stdout.split(os.EOL).shift()
  } catch (error) {
    return ''
  }
}

/**
 * 获取GIT当前所有分支(包含远程)
 * @param folder 项目路径
 */
export async function getBranches(folder: string): Promise<{ locals: string[]; remotes: string[] }> {
  await spawn('git', ['fetch'], { cwd: folder })
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
  await spawn('git', ['fetch'], { cwd: folder })
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

export async function getRemotes(folder: string): Promise<Array<{ name: string; url: string; type: string }>> {
  await spawn('git', ['fetch'], { cwd: folder })
  const stdout = await getStdout('git remote -v', { cwd: folder })
  const remotes = []

  if (stdout) {
    const lines = stdout.trim().split(os.EOL)
    const regexp = /^([\w\d_-]+?)\s+(.+?)\s+\((fetch|push)\)$/
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const [, name, url, type] = line.match(regexp)
      remotes.push({ name, url, type })
    }
  }

  return remotes
}
