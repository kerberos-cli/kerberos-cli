import { program } from 'commander'
import intercept from '../interceptors'
import i18n from '../i18n'

async function takeAction() {
  /** todo... */
}

program
  .command('upgrade')
  .description('not supported in current version')
  .action(() => intercept()(takeAction)())
  .helpOption('-h, --help', i18n.COMMAND__OPTION__HELP_DESC``)
