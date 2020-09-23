import { program } from 'commander'
import chalk from 'chalk'
import { getDependencyGraph, getProjectInfoCollection } from '../services/project'
import { getBranch } from '../services/git'
import { warn } from '../services/logger'
import intercept from '../interceptors'
import * as Types from '../types'

function showDependencies(
  dependencies: string[],
  projects: Types.DProject[],
  dependencyGraph: Types.FlattenDependencyList,
  queue: string[] = [],
  shown: string[] = [],
  spaces: number = 2
) {
  if (Array.isArray(dependencies) && dependencies.length > 0) {
    dependencies.forEach((name) => {
      if (-1 !== shown.indexOf(name)) {
        const message = chalk.grey(`${new Array(spaces).fill(' ').join('')}↳ ...`)
        console.log(message)

        warn(`There are circular references between projects: ${queue.concat([name]).join(' > ')}`)
        return
      }

      shown.push(name)

      const project = projects.find((item) => item.name === name)
      const message = chalk.grey(`${new Array(spaces).fill(' ').join('')}↳ ${chalk.magenta(name)}`)
      console.log(message)

      const subGraph = dependencyGraph.find((item) => item.name === project.name)
      if (Array.isArray(subGraph?.dependencies) && subGraph.dependencies.length > 0) {
        showDependencies(subGraph.dependencies, projects, dependencyGraph, queue.concat([name]), shown, spaces * 2)
      }
    })
  }
}

async function takeAction(options?: Types.CLILsOptions): Promise<void> {
  const projects = await getProjectInfoCollection()
  const finalProjects = options?.project ? projects.filter((project) => project.name === options.project) : projects
  const branches = await Promise.all(finalProjects.map((project) => getBranch(project.folder)))
  const dependencyGraph = options?.dependencies ? await getDependencyGraph() : []

  finalProjects.forEach(({ name, version }, index) => {
    const branch = branches[index]
    const message = chalk.grey(`- ${chalk.white.bold(name)}@${chalk.cyan.bold(version)} >> ${chalk.green.bold(branch)}`)
    console.log(message)

    const dependency = dependencyGraph.find((item) => item.name === name)
    showDependencies(dependency?.dependencies, projects, dependencyGraph, [name], [name])
  })
}

program
  .command('ls')
  .description('show all project information')
  .option('-p, --project <project>', 'specify the project to show information')
  .option('-d, --dependencies [dependencies]', 'show the list of dependencies')
  .action((options?: Types.CLILsOptions) => intercept()(takeAction)(options))