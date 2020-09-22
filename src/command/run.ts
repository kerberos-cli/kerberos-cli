import { program } from 'commander'
import { spawn } from '../services/process'
import intercept from '../interceptors'
import tryGetProject from './share/tryGetProject'
import tryGetScript from './share/tryGetScript'
import * as Types from '../types'

async function takeAction(script?: string, options?: Types.CLIRunOptions): Promise<void> {
  const project = await tryGetProject('Please select the project to be executed.', options?.project)
  const { folder, package: pkgJson } = project || {}
  const { scripts } = pkgJson || {}
  const scriptName = await tryGetScript('Please select a script to run.', scripts, script)
  await spawn('yarn', ['run', scriptName], { cwd: folder })
}

program
  .command('run [script]')
  .description('execute project script')
  .option('-p, --project <project>', 'specify the project to run npm-scripts')
  .action((script: string, options?: Types.CLIRunOptions) => intercept()(takeAction)(script, options))
