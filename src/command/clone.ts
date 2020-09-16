import path from 'path'
import { program } from 'commander'
import isGitUrl from 'is-git-url'
import { openConfigFile, selectPackage } from '../services/project'
import { clone as gitClone } from '../services/git'
import { configFile, execPath } from '../constants/config'
import * as Types from '../types'

async function clone (repo: string, folder?: string, options?: Types.CerberusOptions) {
  if (!isGitUrl(repo)) {
    throw new Error('Repo is not a valid git url')
  }
  
  const file = options?.config || configFile
  const source = await openConfigFile(file, { cwd: options?.cwd })
  const target = typeof folder === 'string' ? (path.isAbsolute(folder) ? folder : path.join(options?.cwd || execPath, folder)) : await selectPackage(source)
  await gitClone(repo, null, target)
}

program
.command('clone <repo> [folder]')
.description('git clone repository')
.option('-c, --config <config>', 'set the config file of the cerberus.')
.option('--cwd <cwd>', 'set the current working directory of the Node.js process.')
.action((repo: string, folder?: string, options?: Types.CerberusOptions) => clone(repo, folder, options))
