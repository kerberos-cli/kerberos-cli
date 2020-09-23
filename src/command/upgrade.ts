import { program } from 'commander'
import intercept from '../interceptors'

async function takeAction() {
  /** todo... */
}

program
  .command('upgrade')
  .description('not supported in current version')
  .action(() => intercept()(takeAction)())
