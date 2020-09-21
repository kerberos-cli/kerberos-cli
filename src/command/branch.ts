import { program } from 'commander'
import { spawn } from '../services/process'
import intercept from '../interceptors'
import tryGetProject from './share/tryGetProject'

type CLIBranchesOptions = {
  project?: string
}

async function takeAction(options?: CLIBranchesOptions): Promise<void> {
  const { folder } = await tryGetProject('Please select the project to view the branch.', options?.project)
  await spawn('git', ['branch', '-a'], { cwd: folder })
}

program
  .command('branch')
  .description("show all project's branches (locals and remotes).")
  .option('-p, --project <project>', 'set project that exec command.')
  .action((options?: CLIBranchesOptions) => intercept()(takeAction)(options))
