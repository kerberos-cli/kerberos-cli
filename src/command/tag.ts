import { program } from 'commander'
import { getDirtyProjects } from '../services/project'
import { selectProjects } from '../services/ui'
import intercept from '../interceptors'

async function takeAction() {
  const projects = await selectProjects()
  const dirtyProjects = await getDirtyProjects()
  if (dirtyProjects.length > 0 && -1 !== dirtyProjects.findIndex(item => -1 !== projects.findIndex(project => project.name === item.name))) {
    const names = dirtyProjects.map((item: { name: string; version: string; folder: string }) => item.name)
    throw new Error(`Some files in the projects are in temporary storage (not submitted), please submit first.\n${names.map(name => ` - ${name} `).join('  \n')}`)
  }

  console.log(projects)
}

program.command('tag').action(() => intercept()(takeAction)())
