import { program } from 'commander'
import { promisify } from 'util'
import commandExists from 'command-exists'
import { spawn } from '../services/process'
import { rootPath } from '../constants/conf'
import tryGetProject from './share/tryGetProject'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(command: string, options?: Types.CLIExecOptions): Promise<void> {
  if (options?.root) {
    const [cli, ...params] = command.split(' ')
    await spawn(cli, params, { cwd: rootPath, shell: true })
    return
  }

  const project = await tryGetProject(i18n.COMMAND__EXEC__SELECT_PROJECT``, options?.project)
  const { folder } = project || {}
  const [cli, ...params] = command.split(' ')
  if (!(await promisify(commandExists)(cli))) {
    throw new Error(i18n.COMMAND__EXEC__ERROR_NOT_FOUND_COMMAND`${cli}`)
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
  .command('exec <command>')
  .description(i18n.COMMAND__EXEC__DESC``, {
    command: i18n.COMMAND__EXEC__ARGS_COMMAND``,
  })
  .option('-p, --project <project>', i18n.COMMAND__EXEC__OPTION_PROJECT``)
  .option('-r, --root', i18n.COMMAND__EXEC__OPTION_ROOT``)
  .action((command: string, options?: Types.CLIExecOptions) => intercept(null, null, ['branch'])(takeAction)(command, options))
