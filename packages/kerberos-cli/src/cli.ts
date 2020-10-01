import { program } from 'commander'
import i18n from './i18n'
import { version } from './constants/config'
import './extends/inquirer'

import './command/init'
import './command/bootstrap'
import './command/install'
import './command/ls'
import './command/clone'
import './command/checkout'
import './command/branch'
import './command/tag'
import './command/upgrade'
import './command/run'
import './command/run-multi'
import './command/exec'
import './command/exec-multi'
import './command/it'
import './command/support'

const argv = ['node', 'kerberos'].concat(process.argv.slice(2))

program.name('kerberos').usage('<command> [options]')
program.addHelpCommand('help', i18n.COMMAND__HELP__DESC``)
program.version(version, '-v, --version', i18n.COMMAND__OPTION__VERSION_DESC``)
program.helpOption('-h, --help', i18n.COMMAND__OPTION__HELP_DESC``)
program.parse(argv)
