import { program } from 'commander'
import waterfall from 'promise-waterfall'
import { spawn } from '../services/process'
import { getDependencyGraph } from '../services/project'
import { getDependencyWeight } from '../services/pm'
import { warn } from '../services/logger'
import tryGetProjects from './share/tryGetProjects'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(scriptName: string, options?: Types.CLIRunMultiOptions): Promise<void> {
  const projects = await tryGetProjects(i18n.COMMAND__RUN_MULTI__SELECT_PROJECT``, options?.projects)
  if (projects.length === 0) {
    return
  }

  if (options?.parallel) {
    await Promise.all(
      projects.map(async ({ name, folder, package: pkgJSON }) => {
        const { scripts = {} } = pkgJSON || {}
        if (typeof scripts[scriptName] !== 'string') {
          warn(i18n.COMMAND__RUN_MULTI__WARN_NOT_FOUND_PROJECT`${scriptName} ${name}`)
          return
        }

        const command = scripts[scriptName]
        const [cli, ...params] = command.split(' ')
        await spawn(cli, params, { cwd: folder, shell: true })
      })
    )
  } else {
    const dependencyGraph = await getDependencyGraph(projects)
    const weightGraph = getDependencyWeight(dependencyGraph)

    const queue: string[][] = []
    weightGraph.forEach(({ name, weight }) => {
      if (!Array.isArray(queue[weight])) {
        queue[weight] = []
      }

      queue[weight].push(name)
    })

    await waterfall(
      queue.map((group) => async () => {
        return Promise.all(
          group.map(async (projectName) => {
            const { folder, package: pkgJSON } = projects.find((project) => project.name === projectName)
            const { scripts = {} } = pkgJSON || {}
            if (typeof scripts[scriptName] !== 'string') {
              warn(i18n.COMMAND__RUN_MULTI__WARN_NOT_FOUND_PROJECT`${scriptName} ${projectName}`)
              return
            }

            const command = scripts[scriptName]
            const [cli, ...params] = command.split(' ')
            await spawn(cli, params, { cwd: folder, shell: true })
          })
        )
      })
    )
  }
}

program
  .command('run-multi <script>')
  .alias('mrun')
  .description(i18n.COMMAND__RUN_MULTI__DESC``)
  .option('-p, --project <projects...>', i18n.COMMAND__RUN_MULTI__OPTION_PROJECT``)
  .option('--parallel [parallel]', i18n.COMMAND__RUN_MULTI__OPTION_PARALLEL``)
  .action((script: string) => intercept()(takeAction)(script))
