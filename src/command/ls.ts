import { program } from 'commander'
import chalk from 'chalk'
import { getDependencyGraph, getProjectInfoCollection } from '../services/project'
import { getBranch } from '../services/git'
import intercept from '../interceptors'
import * as Types from '../types'

async function takeAction(options?: Types.CLILsOptions): Promise<void> {
  const projects = await getProjectInfoCollection()
  const branches = await Promise.all(projects.map(project => getBranch(project.folder)))
  const dependencyGraph = options?.dependencies ? await getDependencyGraph() : []
  const graph = dependencyGraph.map(({ name, dependencies: deps }) => {
    const dependencies = deps?.map(dep => projects.find(item => item.name === dep))
    return { name, dependencies }
  })

  projects.forEach(({ name, version }, index) => {
    const branch = branches[index]
    const message = chalk.grey(`- ${chalk.white.bold(name)}@${chalk.cyan.bold(version)} >> ${chalk.green.bold(branch)}`)
    console.log(message)

    const dependency = graph.find(item => item.name === name)
    dependency?.dependencies.forEach(({ name }) => {
      const message = chalk.grey(`  ↳ ${chalk.magenta(name)}`)
      console.log(message)
    })
  })
}

program
  .command('ls')
  .description('show all project information')
  .option('-d, --dependencies [dependencies]', 'show the list of dependencies')
  .action((options?: Types.CLILsOptions) => intercept()(takeAction)(options))
