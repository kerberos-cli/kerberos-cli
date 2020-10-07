import chalk from 'chalk'
import { program } from 'commander'
import { upperFirst } from 'lodash'
import { getGitVersion } from '../services/git'
import { getYarnVersion } from '../services/pm'
import { success, fail } from '../services/logger'
import i18n from '../i18n'

async function takeAction(): Promise<void> {
  const versions = {
    git: await getGitVersion(),
    yarn: await getYarnVersion(),
  }

  const supported = Object.keys(versions).filter((name) => {
    const version = versions[name]
    const icon = version ? '✓' : '✗'
    console.log(chalk.gray(` ${chalk.green.bold(icon)} ${chalk.white.bold(upperFirst(name))}@${chalk.magenta.bold(version)}`))
    return !version
  })

  if (supported.length === 0) {
    success(chalk.cyan(i18n.COMMAND__SUPPORT__SUCCESS``))
  } else {
    fail(i18n.COMMAND__SUPPORT__ERROR_INSTALL_FIRST`${supported.join(', ')}`)
  }
}

program
  .command('support')
  .description(i18n.COMMAND__SUPPORT__DESC``)
  .action(() => takeAction())
