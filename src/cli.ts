import { program } from 'commander'
import './extends/inquirer'

import './command/init'
import './command/bootstrap'
import './command/install'
import './command/ls'
import './command/clone'
import './command/checkout'
import './command/branch'
import './command/tag'
import './command/run'
import './command/run-multi'
import './command/exec'
import './command/exec-multi'
import './command/support'

const argv = ['node', 'kerberos'].concat(process.argv.slice(2))

program
  .name('kerberos')
  .usage('<command> [options]')
  .parse(argv)
