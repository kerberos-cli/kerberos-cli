import { program } from 'commander'
import { spawn } from '../services/process'
import lineUp from './share/lineUp'
import tryGetProjects from './share/tryGetProjects'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(dependencies: string[], options: Types.CLIRemoveOptions = {}): Promise<void> {
  const projects = await tryGetProjects(i18n.COMMAND__RUN_MULTI__SELECT_PROJECT``, options?.projects)
  if (projects.length === 0) {
    return
  }

  await lineUp(projects, async ({ folder }) => {
    const options = { cwd: folder, shell: true }
    const args = ['remove', ...dependencies]
    await spawn('yarn', args, options)
  })
}

program
  .command('remove <dependencies...>')
  .description(i18n.COMMAND__REMOVE__DESC``, {
    dependencies: i18n.COMMAND__REMOVE__ARGS_DEPENDENCIES``,
  })
  .option('-p, --project <projects...>', i18n.COMMAND__REMOVE__OPTION_PROJECT``)
  .action((dependencies: string[], options: Types.CLIRemoveOptions) => intercept()(takeAction)(dependencies, options))
