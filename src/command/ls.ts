import { program } from 'commander'
import chalk from 'chalk'
import { getProjects } from '../services/project'
import { getBranch } from '../services/git'
import intercept from '../interceptors'

async function takeAction(): Promise<void> {
  const projects = await getProjects()
  const branches = await Promise.all(projects.map(project => getBranch(project.folder)))

  projects.forEach(({ name, version }, index) => {
    const branch = branches[index]
    const message = chalk.grey(`- ${chalk.white.bold(name)}@${chalk.cyan.bold(version)} >> ${chalk.green.bold(branch)}`)
    console.log(message)
  })
}

program
  .command('ls')
  .description('show all projects info.')
  .action(() => intercept()(takeAction)())
