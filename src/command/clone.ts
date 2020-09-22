import path from 'path'
import { program } from 'commander'
import isGitUrl from 'is-git-url'
import { addProjects, getConfig } from '../services/project'
import { gitClone } from '../services/git'
import { success } from '../services/logger'
import intercept from '../interceptors'
import tryGetWorkspace from './share/tryGetWorkspace'
import * as Types from '../types'

async function takeAction(repository: string, name: string = path.basename(repository).replace('.git', ''), optoins?: Types.CLICloneOptions): Promise<void> {
  if (!isGitUrl(repository)) {
    throw new Error('Repo is not a valid git url')
  }

  const { name: workspace, folder } = await tryGetWorkspace('Please select a workspace to clone the repository.', optoins?.workspace)
  const config = await getConfig()
  const projects = config?.projects || []
  if (-1 !== projects.findIndex(item => item.name === name && item.workspace)) {
    throw new Error('There is a project with the same name already exists.')
  }

  if (!(await gitClone(repository, name, folder))) {
    throw new Error('Git clone error.')
  }

  const optional = typeof optoins?.optional === 'boolean' ? optoins?.optional : false
  await addProjects([{ name, repository, workspace, optional }])
  success('Git clone project completed.')
}

program
  .command('clone <repo> [name]')
  .description('clone the git repository to the workspace')
  .option('-w, --workspace <workspace>', 'specify the workspace of git clone')
  .option('-o, --optional [optional]', 'specify the repository as selective installation')
  .action((repo: string, name?: string, optoins?: Types.CLICloneOptions) => intercept()(takeAction)(repo, name, optoins))
