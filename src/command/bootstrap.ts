import { program } from 'commander'
import { getPackages } from '../services/project'
import * as Types from '../types'

async function bootstrap(options: Types.CerberusOptions) {
  
}

program
.command('bootstrap')
.option('--cwd <cwd>', 'set the current working directory of the Node.js process.')
.action((options: Types.CerberusOptions) => bootstrap(options))
