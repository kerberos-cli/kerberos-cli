import { program } from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { promisify } from 'util'
import trim from 'lodash/trim'
import commandExists from 'command-exists'
import { spawn } from '../services/process'
import intercept from '../interceptors'
import tryGetProject from './share/tryGetProject'

type CLIExecOptions = {
  project?: string
  excuteOnce?: boolean
}

async function takeAction(commandline?: string, options?: CLIExecOptions): Promise<void> {
  const { excuteOnce: isExcuteOnce } = options
  const { name, folder } = await tryGetProject('Please select the project to be executed.', options?.project)

  const excute = async function(command: string) {
    const [cli, ...params] = command.split(' ')
    if (!(await promisify(commandExists)(cli))) {
      throw new Error(`Command not found: ${cli}`)
    }

    await spawn(cli, params, { cwd: folder })
  }

  if (typeof commandline === 'string' && trim(commandline)) {
    await excute(commandline)

    if (isExcuteOnce) {
      return
    }
  }

  while (true) {
    const { value: command } = await inquirer.prompt({
      type: 'input',
      name: 'value',
      message: `$ ${name} % ${chalk.grey('Press <Ctrl+C> or input empty and press <Enter> to exits.')}`,
    })

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
  .command('exec [commandline...]')
  .description('execute commands from the project.')
  .option('-p, --project <project>', 'set project that exec command.')
  .option('--excute-once <excuteOnce>', 'exit after executing the command once.')
  .action((commandline: string[], options?: CLIExecOptions) => intercept()(takeAction)(commandline.join(' '), options))
