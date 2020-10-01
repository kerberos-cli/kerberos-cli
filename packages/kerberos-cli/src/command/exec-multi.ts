import { promisify } from 'util'
import { program } from 'commander'
import commandExists from 'command-exists'
import waterfall from 'promise-waterfall'
import { spawn } from '../services/process'
import { getDependencyGraph } from '../services/project'
import { getDependencyWeight } from '../services/pm'
import intercept from '../interceptors'
import tryGetProjects from './share/tryGetProjects'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(command: string, options?: Types.CLIExecMultiOptions): Promise<void> {
  const projects = await tryGetProjects(i18n.COMMAND__EXEC_MULTI__SELECT_PROJECT``, options?.project)
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
    throw new Error(i18n.COMMAND__EXEC_MULTI__ERROR_NOT_FOUND_COMMAND`${cli}`)
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
  .description(i18n.COMMAND__EXEC_MULTI__DESC``)
  .option('-p, --project <project...>', i18n.COMMAND__EXEC_MULTI__OPTION_PROJECT``)
  .action((command: string, options?: Types.CLIExecMultiOptions) => intercept()(takeAction)(command, options))
  .helpOption('-h, --help', i18n.COMMAND__OPTION__HELP_DESC``)
