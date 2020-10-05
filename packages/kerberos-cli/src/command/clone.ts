import fs from 'fs-extra'
import path from 'path'
import { program } from 'commander'
import isGitUrl from 'is-git-url'
import { getConfig, addProjectsToConfig } from '../services/project'
import { gitClone } from '../services/git'
import { success } from '../services/logger'
import intercept from '../interceptors'
import tryGetWorkspace from './share/tryGetWorkspace'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(repository: string, name: string = path.basename(repository).replace('.git', ''), optoins?: Types.CLICloneOptions): Promise<void> {
  if (!isGitUrl(repository)) {
    throw new Error(i18n.COMMAND__CLONE__ERROR_INVALID_REPO``)
  }

  const { name: workspace, folder } = await tryGetWorkspace(i18n.COMMAND__CLONE__SELECT_WORKSPACE``, optoins?.workspace)
  const config = await getConfig()
  const projects = config?.projects || []
  if (-1 !== projects.findIndex((item) => item.name === name && item.workspace)) {
    throw new Error(i18n.COMMAND__CLONE__ERROR_EXISTS_PROJECT``)
  }

  if (!(await gitClone(repository, name, folder))) {
    throw new Error(i18n.COMMAND__CLONE__ERROR_FAILE_CLONE``)
  }

  const pkgFile = path.join(folder, name, 'package.json')
  if (!(await fs.pathExists(pkgFile))) {
    throw new Error(i18n.COMMAND__CLONE__ERROR_INVALID_NODE_PROJECT``)
  }

  const pkgJson: Types.CPackage = await fs.readJSON(pkgFile)
  const realname = pkgJson?.name
  if (!(typeof realname === 'string' && realname.length > 0)) {
    throw new Error(i18n.COMMAND__CLONE__ERROR_INVALID_PROJECT_NAME``)
  }

  const optional = typeof optoins?.optional === 'boolean' ? optoins?.optional : false
  await addProjectsToConfig([{ name: realname, repository, workspace, optional }])
  success(i18n.COMMAND__CLONE__SUCCESS_COMPLETE``)
}

program
  .command('clone <repo> [name]')
  .description(i18n.COMMAND__CLONE__DESC``)
  .option('-w, --workspace <workspace>', i18n.COMMAND__CLONE__OPTION_WORKSPACE``)
  .option('-o, --optional [optional]', i18n.COMMAND__CLONE__OPTION_OPTIONAL``)
  .action((repo: string, name?: string, optoins?: Types.CLICloneOptions) => intercept()(takeAction)(repo, name, optoins))
  .helpOption('-h, --help', i18n.COMMAND__OPTION__HELP_DESC``)
