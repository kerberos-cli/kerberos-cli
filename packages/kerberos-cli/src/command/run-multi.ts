import { program } from 'commander'
import waterfall from 'promise-waterfall'
import { spawn } from '../services/process'
import { getDependencyGraph } from '../services/project'
import { getDependencyWeight } from '../services/pm'
import { warn } from '../services/logger'
import intercept from '../interceptors'
import { multiSelect } from '../services/ui'

async function takeAction(script: string): Promise<void> {
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

  await waterfall(
    queue.map((group) => async () => {
      return Promise.all(
        group.map(async (name) => {
          const { folder, package: pkgJSON } = projects.find((project) => project.name === name)
          const { scripts = {} } = pkgJSON || {}
          if (typeof scripts[script] !== 'string') {
            warn(`Script ${script} not found in project ${name}`)
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
  .description('execute script in multiple projects')
  .action((script: string) => intercept()(takeAction)(script))
