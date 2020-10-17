import { program } from 'commander'
import { getPackage } from '../services/project'
import { spawn } from '../services/process'
import { rootPath } from '../constants/conf'
import tryGetProject from './share/tryGetProject'
import tryGetScript from './share/tryGetScript'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(scriptName?: string, options?: Types.CLIRunOptions): Promise<void> {
  if (options?.root) {
    const { scripts } = (await getPackage()) || {}
    const script = await tryGetScript(i18n.COMMAND__SCRIPT__SELECT_SCRIPT``, scripts, scriptName)
    if (!script) {
      return
    }

    const { command } = script
    const [cli, ...params] = command.split(' ')
    await spawn(cli, params, { cwd: rootPath, shell: true })
    return
  }

  const project = await tryGetProject(i18n.COMMAND__RUN__SELECT_PROJECT``, options?.project)
  const { folder, package: pkgJson } = project || {}
  const { scripts } = pkgJson || {}
  const script = await tryGetScript(i18n.COMMAND__RUN__SELECT_SCRIPT``, scripts, scriptName)
  const { command } = script
  const [cli, ...params] = command.split(' ')
  await spawn(cli, params, { cwd: folder, shell: true })
}

program
  .command('run [script]')
  .description(i18n.COMMAND__RUN__DESC``, {
    script: i18n.COMMAND__RUN__ARGS_SCRIPT``,
  })
  .option('-p, --project <project>', i18n.COMMAND__RUN__OPTION_PROJECT``)
  .option('-r, --root', i18n.COMMAND__RUN__OPTION_ROOT``)
  .action((script: string, options?: Types.CLIRunOptions) => intercept(null, null, ['branch'])(takeAction)(script, options))
