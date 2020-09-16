import fs from 'fs-extra'
import path from 'path'
import { program } from 'commander'
import { execPath, configFile } from '../constants/config'
import * as Types from '../types'

async function init(options: Types.CerberusOptions) {
  const folder = options?.cwd || execPath
  await fs.ensureDir(folder)
  
  const config = path.join(folder, configFile)
  await fs.writeJSON(config, { pacakges: ['pacakges/*'] })
}

program
.command('init')
.option('--cwd <cwd>', 'set the current working directory of the Node.js process.')
.action((options: Types.CerberusOptions) => init(options))
