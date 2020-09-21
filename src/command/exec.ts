import { program } from 'commander'
import chalk from 'chalk'
import { promisify } from 'util'
import trim from 'lodash/trim'
import commandExists from 'command-exists'
import { spawn } from '../services/process'
import { inputCommand } from '../services/ui'
import intercept from '../interceptors'
import tryGetProject from './share/tryGetProject'

type CLIExecOptions = {
  project?: string
  excuteOnce?: boolean
}

async function takeAction(command?: string, options?: CLIExecOptions): Promise<void> {
  const { excuteOnce: isExcuteOnce, project } = options || {}
  const { name, folder } = await tryGetProject('Please select the project to be executed.', project)

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

  if (typeof command === 'string' && trim(command)) {
    await excute(command)

    if (isExcuteOnce) {
      return
    }
  }

  while (true) {
    const command = await inputCommand(`${name} ${chalk.green.bold('>')}`)
    if (typeof command === 'string' && command.length > 0) {
      await excute(command)
      if (isExcuteOnce) {
        break
      }

      continue
    }

    break
  }
}

program
  .command('exec [command...]')
  .description('execute commands from the project.')
  .option('-p, --project <project>', 'specify the project to run npm-scripts.')
  .option('--excute-once <excuteOnce>', 'exit after executing the command once.')
  .action((command: string[], options?: CLIExecOptions) => intercept()(takeAction)(command.join(' '), options))
