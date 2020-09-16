import { program } from 'commander'
import { version } from './constants/conf'

import './command/init'
import './command/exec'
import './command/bootstrap'

program.version(version, '-v, --version')

const argv = process.argv
program.parse(argv)
