import { program } from 'commander'
import { getDirtyProjectInfoCollection } from '../services/project'
import { multiSelect } from '../services/ui'
import intercept from '../interceptors'

async function takeAction() {
  const projects = await multiSelect('project')('please select projects to tag')
  const dirtyProjects = await getDirtyProjectInfoCollection()
  if (dirtyProjects.length > 0 && -1 !== dirtyProjects.findIndex(item => -1 !== projects.findIndex(project => project.name === item.name))) {
    const names = dirtyProjects.map((item: { name: string; version: string; folder: string }) => item.name)
    throw new Error(`Some files in the projects are in temporary storage (not submitted), please submit first.\n${names.map(name => ` - ${name} `).join('  \n')}`)
  }

  console.log(
    projects.map(item => ({
      name: `${item.name}@${item.version}`,
    }))
  )

  // inquirer.prompt({
  //   type: 'input',
  //   name: 'tag',
  // })
}

program
  .command('tag')
  .description('not supported in current version')
  .action(() => intercept()(takeAction)())
