import { program } from 'commander'
import { spawn } from '../services/process'
import lineup from './share/lineup'
import tryGetProjects from './share/tryGetProjects'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(dependencies: string[], options: Types.CLIRemoveOptions = {}): Promise<void> {
  const projects = await tryGetProjects(i18n.COMMAND__RUN_MULTI__SELECT_PROJECT``, options?.projects)
  if (projects.length === 0) {
    return
  }

  const params = []
  if (options?.dev) {
    params.push('--dev')
  }

  if (options?.peer) {
    params.push('--peer')
  }

  if (options?.optional) {
    params.push('--optional')
  }

  await lineup(projects, async ({ folder }) => {
    const options = { cwd: folder, shell: true }
    const args = ['remove', ...params, ...dependencies]
    await spawn('yarn', args, options)
  })
}

program
  .command('remove <dependencies...>')
  .description(i18n.COMMAND__REMOVE__DESC``, {
    dependencies: i18n.COMMAND__REMOVE__ARGS_DEPENDENCIES``,
  })
  .option('-p, --project <projects...>', i18n.COMMAND__REMOVE__OPTION_PROJECT``)
  .option('-D, --dev', i18n.COMMAND__REMOVE__OPTION_DEV``)
  .option('-P, --peer', i18n.COMMAND__REMOVE__OPTION_PEER``)
  .option('-O, --optional', i18n.COMMAND__REMOVE__OPTION_OPTIONAL``)
  .action((dependencies: string[], options: Types.CLIRemoveOptions) => intercept()(takeAction)(dependencies, options))
