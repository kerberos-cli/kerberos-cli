import { program } from 'commander'
import * as Types from '../types'

async function version (options: Types.CerberusOptions) {

}

program
.command('version')
.option('--cwd <cwd>', 'set the current working directory of the Node.js process.')
.action((options: Types.CerberusOptions) => version(options))
