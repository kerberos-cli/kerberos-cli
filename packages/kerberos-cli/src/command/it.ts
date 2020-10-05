import path from 'path'
import fs from 'fs-extra'
import { program } from 'commander'
import chalk from 'chalk'
import { promisify } from 'util'
import commandExists from 'command-exists'
import { spawn } from '../services/process'
import { getProjectInfoCollection } from '../services/project'
import { inputCommand } from '../services/ui'
import intercept from '../interceptors'
import { execPath } from '../constants/conf'
import tryGetProject from './share/tryGetProject'
import { fail } from '../services/logger'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(options?: Types.CLIItOptions): Promise<void> {
  const cwd = process.cwd()
  const folder: string = await (async () => {
    const initialOptions = {}
    if (execPath !== cwd) {
      const defaultProject = (await getProjectInfoCollection()).find((project) => -1 !== execPath.indexOf(project.folder))
      Object.assign(initialOptions, { default: defaultProject.name })
    }

    const project = await tryGetProject(i18n.COMMAND__IT__SELECT_PROJECT``, options?.project, initialOptions)
    return project?.folder
  })()

  if (!folder) {
    throw new Error(i18n.COMMAND__IT__ERROR_FOLDER_NOT_FOUND``)
  }

  const excute = async function (command: string) {
    const [cli, ...params] = command.split(' ')
    if (!(await promisify(commandExists)(cli))) {
      throw new Error(i18n.COMMAND__IT__ERROR_COMMAND_NOT_FOUND`${cli}`)
    }

    try {
      /**
       * 因为这里执行的命令可能根据环境变量路径等,
       * 可能会导致执行失败错误等导致程序退出;
       * 因此这里使用执行脚本方式去执行命令,
       * 相当于使用 exec
       * @see https://stackoverflow.com/questions/27688804/how-do-i-debug-error-spawn-enoent-on-node-js
       */
      await spawn(cli, params, { cwd: folder, shell: true })
    } catch (error) {
      // nothing todo...
    }
  }

  const pkgJSON: Types.CPackage = await fs.readJSON(path.join(folder, 'package.json'))
  console.log(chalk.gray(i18n.COMMAND__IT__HELP_EXIT``))

  InputLoop: while (true) {
    const command = await inputCommand(`${pkgJSON.name} ${chalk.green.bold('>')}`)
    if (command === 'exit') {
      break
    }

    switch (command) {
      case 'exit':
        break InputLoop
    }

    try {
      if (typeof command === 'string' && command.length > 0) {
        await excute(command)
      }
    } catch (error) {
      fail(error)
    }
  }
}

program
  .command('it')
  .description(i18n.COMMAND__IT__DESC``)
  .option('-p, --project <project>', i18n.COMMAND__IT__OPTION_PROJECT``)
  .action((options?: Types.CLIItOptions) => intercept()(takeAction)(options))
  .helpOption('-h, --help', i18n.COMMAND__OPTION__HELP_DESC``)
