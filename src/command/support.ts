import chalk from 'chalk'
import { program } from 'commander'
import { supportedGit } from '../services/git'
import { supportedYarn } from '../services/pm'

async function takeAction(): Promise<void> {
  const supports = {
    git: await supportedGit(),
    yarn: await supportedYarn(),
  }

  const allSupported = Object.keys(supports).filter(name => {
    const supported = supports[name]
    console.log(` ${chalk.green.bold(supported ? '✓' : '✗')} ${chalk.white.bold(name)}`)
    return !supported
  })

  if (allSupported.length === 0) {
    console.log(chalk.cyan('All dependencies are ready, you can use cerberus normally.'))
  } else {
    console.log(`Please install ${allSupported.join(', ')} first.`)
  }
}

program
  .command('support')
  .description('determine whether all dependencies have been installed')
  .action(() => takeAction())
