import { promisify } from 'util'
import { program } from 'commander'
import commandExists from 'command-exists'
import waterfall from 'promise-waterfall'
import { spawn } from '../services/process'
import { getDependencyGraph } from '../services/project'
import { getDependencyWeight } from '../services/pm'
import intercept from '../interceptors'
import tryGetProjects from './share/tryGetProjects'
import * as Types from '../types'

async function takeAction(command: string, options?: Types.CLIExecMultiOptions): Promise<void> {
  const projects = await tryGetProjects('Please select a project to run the script.', options?.project)
  const dependencyGraph = await getDependencyGraph(projects)
  const weightGraph = getDependencyWeight(dependencyGraph)

  const queue: string[][] = []
  weightGraph.forEach(({ name, weight }) => {
    if (!Array.isArray(queue[weight])) {
      queue[weight] = []
    }

    queue[weight].push(name)
  })

  const [cli, ...params] = command.split(' ')
  if (!(await promisify(commandExists)(cli))) {
    throw new Error(`Command not found: ${cli}`)
  }

  await waterfall(
    queue.map((group) => async () => {
      return Promise.all(
        group.map(async (name) => {
          const { folder } = projects.find((project) => project.name === name)
          await spawn(cli, params, { cwd: folder })
        })
      )
    })
  )
}

program
  .command('exec-multi [command]')
  .alias('mexec')
  .description('execute commands in multiple projects')
  .option('-p, --project <project...>', 'specify the project to run npm-scripts')
  .action((command: string, options?: Types.CLIExecMultiOptions) => intercept()(takeAction)(command, options))
