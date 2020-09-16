import { program } from 'commander'
import * as Types from '../types'

async function checkout (branch: string, options?: Types.CerberusOptions) {

}

program
.command('checkout <branch>')
.option('--cwd <cwd>', 'set the current working directory of the Node.js process.')
.action((branch: string, options?: Types.CerberusOptions) => checkout(branch, options))
