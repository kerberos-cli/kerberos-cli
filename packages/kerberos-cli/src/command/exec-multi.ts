import { promisify } from 'util'
import { program } from 'commander'
import commandExists from 'command-exists'
import waterfall from 'promise-waterfall'
import { spawn } from '../services/process'
import { getDependencyGraph } from '../services/project'
import { getDependencyWeight } from '../services/pm'
import intercept from '../interceptors'
import { multiSelect } from '../services/ui'

async function takeAction(command: string): Promise<void> {
  const projects = await multiSelect('project')('Please select a project to run the script.')
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
  .command('exec [command]')
  .alias('mexec')
  .description('execute commands in multiple projects')
  .action((command: string) => intercept()(takeAction)(command))
