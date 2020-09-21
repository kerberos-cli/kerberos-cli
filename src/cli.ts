import { program } from 'commander'
import './extends/inquirer'
import './command/bootstrap'
import './command/init'
import './command/ls'
import './command/clone'
import './command/checkout'
import './command/branch'
import './command/tag'
import './command/run'
import './command/exec'
import './command/support'

const argv = ['node', 'cerberus'].concat(process.argv.slice(2))

program
  .name('cerberus')
  .usage('<command> [options]')
  .parse(argv)
