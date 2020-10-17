import { promisify } from 'util'
import { program } from 'commander'
import commandExists from 'command-exists'
import { spawn } from '../services/process'
import { getProjectInfoCollection } from '../services/project'
import lineUp from './share/lineUp'
import intercept from '../interceptors'
import tryGetProjects from './share/tryGetProjects'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(command: string, options?: Types.CLIExecMultiOptions): Promise<void> {
  let projects = options?.all ? await getProjectInfoCollection() : await tryGetProjects(i18n.COMMAND__EXEC_MULTI__SELECT_PROJECT``, options?.projects)
  if (Array.isArray(options?.exclude)) {
    projects = projects.filter(({ name }) => options.exclude.indexOf(name))
  }

  if (projects.length === 0) {
    return
  }

  const [cli, ...params] = command.split(' ')
  if (!(await promisify(commandExists)(cli))) {
    throw new Error(i18n.COMMAND__EXEC_MULTI__ERROR_NOT_FOUND_COMMAND`${cli}`)
  }

  if (options?.parallel) {
    await Promise.all(
      projects.map(async ({ folder }) => {
        await spawn(cli, params, { cwd: folder })
      })
    )
  } else {
    await lineUp(projects, async ({ folder }) => {
      await spawn(cli, params, { cwd: folder })
    })
  }
}

program
  .command('exec-multi <command>')
  .alias('mexec')
  .description(i18n.COMMAND__EXEC_MULTI__DESC``, {
    command: i18n.COMMAND__EXEC_MULTI__ARGS_COMMAND``,
  })
  .option('-p, --projects <projects...>', i18n.COMMAND__EXEC_MULTI__OPTION_PROJECT``)
  .option('-e, --exclude <projects...>', i18n.COMMAND__EXEC_MULTI__OPTION_EXCLUDE``)
  .option('-a, --all', i18n.COMMAND__EXEC_MULTI__OPTION_ALL``)
  .option('--parallel', i18n.COMMAND__EXEC_MULTI__OPTION_PARALLEL``)
  .action((command: string, options?: Types.CLIExecMultiOptions) => intercept(null, null, ['branch'])(takeAction)(command, options))
