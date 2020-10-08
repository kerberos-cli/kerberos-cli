import { program } from 'commander'
import { spawn } from '../services/process'
import { warn } from '../services/logger'
import lineUp from './share/lineUp'
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
  .option('-p, --project <projects...>', i18n.COMMAND__RUN_MULTI__OPTION_PROJECT``)
  .option('--parallel', i18n.COMMAND__RUN_MULTI__OPTION_PARALLEL``)
  .action((script: string) => intercept()(takeAction)(script))
