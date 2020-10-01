import chalk from 'chalk'
import { program } from 'commander'
import { supportedGit } from '../services/git'
import { supportedYarn } from '../services/pm'
import i18n from '../i18n'

async function takeAction(): Promise<void> {
  const supports = {
    git: await supportedGit(),
    yarn: await supportedYarn(),
  }

  const allSupported = Object.keys(supports).filter((name) => {
    const supported = supports[name]
    console.log(` ${chalk.green.bold(supported ? '✓' : '✗')} ${chalk.white.bold(name)}`)
    return !supported
  })

  if (allSupported.length === 0) {
    console.log(chalk.cyan(i18n.COMMAND__SUPPORT__SUCCESS``))
  } else {
    console.log(i18n.COMMAND__SUPPORT__ERROR_INSTALL_FIRST`${allSupported.join(', ')}`)
  }
}

program
  .command('support')
  .description(i18n.COMMAND__SUPPORT__DESC``)
  .action(() => takeAction())
  .helpOption('-h, --help', i18n.COMMAND__OPTION__HELP_DESC``)
