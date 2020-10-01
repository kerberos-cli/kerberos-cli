import { program } from 'commander'
import { spawn } from '../services/process'
import { success } from '../services/logger'
import tryGetProject from './share/tryGetProject'
import tryGetBranch from './share/tryGetBranch'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(options?: Types.CLICheckoutOptions) {
  const { name, folder } = await tryGetProject(i18n.COMMAND__CHECKOUT__SELECT_PROJECT``, options?.project)
  const branch = await tryGetBranch(i18n.COMMAND__CHECKOUT__SELECT_BRANCH``, folder, options?.branch)
  if (!(await spawn('git', ['checkout', branch], { cwd: folder }))) {
    success(i18n.COMMAND__CHECKOUT__SUCCESS_COMPLETE`${name} ${branch}`)
  }
}

program
  .command('checkout')
  .description(i18n.COMMAND__CHECKOUT__DESC``)
  .option('-b, --branch <branch>', i18n.COMMAND__CHECKOUT__OPTION_BRANCH``)
  .option('-p, --project <project>', i18n.COMMAND__CHECKOUT__OPTION_PROJECT``)
  .action((options?: Types.CLICheckoutOptions) => intercept()(takeAction)(options))
