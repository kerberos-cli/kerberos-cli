import { program } from 'commander'
import waterfall from 'promise-waterfall'
import { spawn } from '../services/process'
import { getDependencyGraph } from '../services/project'
import { getDependencyWeight } from '../services/pm'
import { warn } from '../services/logger'
import intercept from '../interceptors'
import i18n from '../i18n'
import { multiSelect } from '../services/ui'

async function takeAction(script: string): Promise<void> {
  const projects = await multiSelect('project')(i18n.COMMAND__RUN_MULTI__SELECT_PROJECT``)
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
        group.map(async (name) => {
          const { folder, package: pkgJSON } = projects.find((project) => project.name === name)
          const { scripts = {} } = pkgJSON || {}
          if (typeof scripts[script] !== 'string') {
            warn(i18n.COMMAND__RUN_MULTI__WARN_NOT_FOUND_PROJECT`${script} ${name}`)
            return
          }

          await spawn('yarn', ['run', script], { cwd: folder })
        })
      )
    })
  )
}

program
  .command('run-multi <script>')
  .alias('mrun')
  .description(i18n.COMMAND__RUN_MULTI__DESC``)
  .action((script: string) => intercept()(takeAction)(script))
  .helpOption('-h, --help', i18n.COMMAND__OPTION__HELP_DESC``)
