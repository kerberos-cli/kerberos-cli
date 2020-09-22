import { program } from 'commander'
import { spawn } from '../services/process'
import { success } from '../services/logger'
import tryGetProject from './share/tryGetProject'
import tryGetBranch from './share/tryGetBranch'
import intercept from '../interceptors'
import * as Types from '../types'

async function takeAction(options?: Types.CLICheckoutOptions) {
  const { name, folder } = await tryGetProject('Please select the project to checkout branch.', options?.project)
  const branch = await tryGetBranch('Please select the branch to checkout branch.', folder, options?.branch)
  if (!(await spawn('git', ['checkout', branch], { cwd: folder }))) {
    success(`Project ${name} has been change branch to ${branch}.`)
  }
}

program
  .command('checkout')
  .description('check out the branch in the package')
  .option('-b, --branch <branch>', 'specify the branch to switch')
  .option('-p, --project <project>', 'specify the project to switch')
  .action((options?: Types.CLICheckoutOptions) => intercept()(takeAction)(options))
