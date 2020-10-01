import { program } from 'commander'
import { spawn } from '../services/process'
import tryGetProject from './share/tryGetProject'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(options?: Types.CLIBranchOptions): Promise<void> {
  const { folder } = await tryGetProject(i18n.COMMAND__BRANCH__SELECT_PROJECT``, options?.project)
  await spawn('git', ['branch', '-a'], { cwd: folder })
}

program
  .command('branch')
  .description(i18n.COMMAND__BRANCH__DESC``)
  .option('-p, --project <project>', i18n.COMMAND__BRANCH__OPTION_PROJECT``)
  .action((options?: Types.CLIBranchOptions) => intercept()(takeAction)(options))
  .helpOption('-h, --help', i18n.COMMAND__OPTION__HELP_DESC``)
