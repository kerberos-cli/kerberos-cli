import waterfall from 'promise-waterfall'
import { getDependencyGraph } from '../../services/project'
import { getDependencyWeight } from '../../services/pm'
import * as Types from '../../types'

export default async function lineup(projects: Types.DProject[], callback: (project: Types.DProject) => Promise<void>) {
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
          const project = projects.find((project) => project.name === name)
          await callback(project)
        })
      )
    })
  )
}
