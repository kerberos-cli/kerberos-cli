import inquirer from 'inquirer'
import { program } from 'commander'

import './command/ls'
import './command/bootstrap'
import './command/tag'
import './command/clone'
import './command/branch'
import './command/checkout'
import './command/init'
import './command/exec'
import './command/support'

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
inquirer.registerPrompt('search-list', require('inquirer-search-list'))
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
inquirer.registerPrompt('search-checkbox', require('inquirer-search-checkbox'))

const argv = ['node', 'cerberus'].concat(process.argv.slice(2))

program
  .name('cerberus')
  .usage('<command> [options]')
  .parse(argv)
