import { program } from 'commander'
import { spawn } from '../services/process'
import intercept from '../interceptors'
import tryGetProject from './share/tryGetProject'
import tryGetScript from './share/tryGetScript'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(scriptName?: string, options?: Types.CLIRunOptions): Promise<void> {
  const project = await tryGetProject(i18n.COMMAND__RUN__SELECT_PROJECT``, options?.project)
  const { folder, package: pkgJson } = project || {}
  const { scripts } = pkgJson || {}
  const script = await tryGetScript(i18n.COMMAND__RUN__SELECT_SCRIPT``, scripts, scriptName)
  const { command } = script
  const [cli, ...params] = command.split(' ')
  await spawn(cli, params, { cwd: folder, shell: true })
}

program
  .command('run [scriptName]')
  .description(i18n.COMMAND__RUN__DESC``)
  .option('-p, --project <project>', i18n.COMMAND__RUN__OPTION_PROJECT``)
  .action((script: string, options?: Types.CLIRunOptions) => intercept()(takeAction)(script, options))
