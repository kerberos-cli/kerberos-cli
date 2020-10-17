import chalk from 'chalk'
import { program } from 'commander'
import { getProjectInfoCollection } from '../services/project'
import { getBranches, getBranchTracking, getBranch } from '../services/git'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(options?: Types.CLIBranchOptions): Promise<void> {
  const projects = await getProjectInfoCollection()
  await Promise.all(
    projects.map(async ({ name, folder }) => {
      const curBranch = await getBranch(folder)
      const { locals, remotes } = await getBranches(folder)
      const tracking = await getBranchTracking(folder)

      console.log(chalk.cyan.bold(`[${name}]`))
      locals.forEach((name) => {
        const remote = tracking[name]
        const isCur = name === curBranch
        const symbol = isCur ? '*' : ' '
        const message = ` ${symbol} ${name}` + (remote ? ` -> ${remote}` : '')
        const content = isCur ? chalk.green(message) : chalk.white(message)
        console.log(content)
      })

      if (options?.all) {
        remotes.forEach((name) => {
          const message = `   ${name}`
          const content = chalk.magenta(message)
          console.log(content)
        })
      }
    })
  )
}

program
  .command('branch')
  .description(i18n.COMMAND__BRANCH__DESC``)
  .option('-a, --all', i18n.COMMAND__BRANCH__OPTION_ALL``)
  .action((options?: Types.CLIBranchOptions) => intercept()(takeAction)(options))
