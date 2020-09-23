import { program } from 'commander'
import { promisify } from 'util'
import commandExists from 'command-exists'
import { spawn } from '../services/process'
import intercept from '../interceptors'
import tryGetProject from './share/tryGetProject'
import * as Types from '../types'

async function takeAction(command?: string, options?: Types.CLIExecOptions): Promise<void> {
  const project = await tryGetProject('Please select the project to be executed.', options?.project)
  const { folder } = project || {}
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

program
  .command('exec [command]')
  .description('execute commands in the project')
  .option('-p, --project <project>', 'specify the project to run npm-scripts')
  .action((command: string, options?: Types.CLIExecOptions) => intercept()(takeAction)(command, options))
