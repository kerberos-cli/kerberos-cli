import { program } from 'commander'
import { spawn } from '../services/process'
import { getPackage } from '../services/project'
import tryGetScript from './share/tryGetScript'
import { rootPath } from '../constants/conf'
import intercept from '../interceptors'
import i18n from '../i18n'

async function takeAction(scriptName?: string): Promise<void> {
  const { scripts } = (await getPackage()) || {}
  const script = await tryGetScript(i18n.COMMAND__SCRIPT__SELECT_SCRIPT``, scripts, scriptName)
  if (!script) {
    return
  }

  const { command } = script
  const [cli, ...params] = command.split(' ')
  await spawn(cli, params, { cwd: rootPath, shell: true })
}

program
  .command('script [scriptName]')
  .description(i18n.COMMAND__SCRIPT__DESC``)
  .action((script: string) => intercept()(takeAction)(script))
  .helpOption('-h, --help', i18n.COMMAND__OPTION__HELP_DESC``)
