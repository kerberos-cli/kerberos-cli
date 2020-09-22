import path from 'path'
import fs from 'fs-extra'
import { program } from 'commander'
import chalk from 'chalk'
import { promisify } from 'util'
import commandExists from 'command-exists'
import { spawn } from '../services/process'
import { getProjectPathCollection } from '../services/project'
import { inputCommand } from '../services/ui'
import intercept from '../interceptors'
import { execPath } from '../constants/config'
import tryGetProject from './share/tryGetProject'
import * as Types from '../types'

async function takeAction(options?: Types.CLIItOptions): Promise<void> {
  const cwd = process.cwd()
  const folder: string = await (async () => {
    if (execPath === cwd || options?.all || options?.project) {
      const project = await tryGetProject('Please select the project to be executed.', options?.project)
      return project?.folder
    }

    const paths = (await getProjectPathCollection()).map(item => path.join(cwd, item))
    return paths.find(item => -1 !== execPath.indexOf(item))
  })()

  if (!folder) {
    throw new Error('Not a kerberos project (or not added to the kerberos.json file)')
  }

  const excute = async function(command: string) {
    const [cli, ...params] = command.split(' ')
    if (!(await promisify(commandExists)(cli))) {
      throw new Error(`Command not found: ${cli}`)
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

  const pkgJSON: Types.DProject['package'] = await fs.readJSON(path.join(folder, 'package.json'))
  while (true) {
    const command = await inputCommand(`${pkgJSON.name} ${chalk.green.bold('>')}`)
    if (typeof command === 'string' && command.length > 0) {
      await excute(command)
    }
  }
}

program
  .command('it')
  .description('specify project and input commands')
  .option('-a, --all [all]', 'show all projects')
  .option('-p, --project <project>', 'specify the project to run npm-scripts')
  .action((options?: Types.CLIItOptions) => intercept()(takeAction)(options))
