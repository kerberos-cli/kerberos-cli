import { program } from 'commander'
import { spawn } from '../services/process'
import tryGetProject from './share/tryGetProject'
import intercept from '../interceptors'
import * as Types from '../types'

async function takeAction(options?: Types.CLIBranchOptions): Promise<void> {
  const { folder } = await tryGetProject('Please select the project to view the branch.', options?.project)
  await spawn('git', ['branch', '-a'], { cwd: folder })
}

program
  .command('branch')
  .description('show all branches of the project (local and remote)')
  .option('-p, --project <project>', 'specify the project to display the branch')
  .action((options?: Types.CLIBranchOptions) => intercept()(takeAction)(options))
