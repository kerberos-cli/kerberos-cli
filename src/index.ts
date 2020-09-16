import { program } from 'commander'

import './command/bootstrap'
import './command/clone'
import './command/init'
import './command/version'

const argv = ['node', 'cerberus'].concat(process.argv.slice(2))

program
.name('cerberus')
.usage('<command> [options]')
.parse(argv)
