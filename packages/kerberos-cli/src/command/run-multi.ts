import { program } from 'commander'
import { spawn } from '../services/process'
import { getProjectInfoCollection } from '../services/project'
import { warn } from '../services/logger'
import lineUp from './share/lineUp'
import tryGetProjects from './share/tryGetProjects'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(scriptName: string, options?: Types.CLIRunMultiOptions): Promise<void> {
  let projects = options?.all ? await getProjectInfoCollection() : await tryGetProjects(i18n.COMMAND__EXEC_MULTI__SELECT_PROJECT``, options?.projects)
  if (Array.isArray(options?.exclude)) {
    projects = projects.filter(({ name }) => options.exclude.indexOf(name))
  }

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
    await lineUp(projects, async ({ name, folder, package: pkgJSON }) => {
      const { scripts = {} } = pkgJSON || {}
      if (typeof scripts[scriptName] !== 'string') {
        warn(i18n.COMMAND__RUN_MULTI__WARN_NOT_FOUND_PROJECT`${scriptName} ${name}`)
        return
      }

      const command = scripts[scriptName]
      const [cli, ...params] = command.split(' ')
      await spawn(cli, params, { cwd: folder, shell: true })
    })
  }
}

program
  .command('run-multi <script>')
  .alias('mrun')
  .description(i18n.COMMAND__RUN_MULTI__DESC``, {
    script: i18n.COMMAND__RUN_MULTI__ARGS_SCRIPT``,
  })
  .option('-p, --projects <projects...>', i18n.COMMAND__RUN_MULTI__OPTION_PROJECT``)
  .option('-e, --exclude <projects...>', i18n.COMMAND__EXEC_MULTI__OPTION_EXCLUDE``)
  .option('-a, --all', i18n.COMMAND__EXEC_MULTI__OPTION_ALL``)
  .option('--parallel', i18n.COMMAND__RUN_MULTI__OPTION_PARALLEL``)
  .action((script: string, options?: Types.CLIRunMultiOptions) => intercept()(takeAction)(script, options))
