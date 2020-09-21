import { program } from 'commander'
import { spawn } from '../services/process'
import { success } from '../services/logger'
import intercept from '../interceptors'
import tryGetProject from './share/tryGetProject'
import tryGetBranch from './share/tryGetBranch'

type CLICheckoutOptions = {
  branch?: string
  project?: string
}

async function takeAction(options?: CLICheckoutOptions) {
  const { name, folder } = await tryGetProject('Please select the project to checkout branch.', options?.project)
  const branch = await tryGetBranch('Please select the branch to checkout branch.', folder, options?.branch)
  if (!(await spawn('git', ['checkout', branch], { cwd: folder }))) {
    success(`Project ${name} has been change branch to ${branch}.`)
  }
}

program
  .command('checkout')
  .description('checkout git branch in the packages.')
  .option('-b, --branch <branch>', 'specify the branch to switch.')
  .option('-p, --project <project>', 'set project that exec command.')
  .action((options?: CLICheckoutOptions) => intercept()(takeAction)(options))
