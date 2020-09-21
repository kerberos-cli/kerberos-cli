import { program } from 'commander'
import { spawn } from '../services/process'
import { gSel } from '../services/ui'
import tryGetProject from './share/tryGetProject'
import intercept from '../interceptors'

type CLIRunOptions = {
  project?: string
}

type ScriptChoice = {
  name: string
  command: string
}

async function takeAction(script?: string, options?: CLIRunOptions): Promise<void> {
  const project = await tryGetProject('Please select the project to be executed.', options?.project)
  const { folder, scripts = {} } = project || {}

  const loader = (): ScriptChoice[] => {
    return Object.keys(scripts).map(name => {
      const command = scripts[name]
      return { name, command }
    })
  }

  const tryGetScript = async (specified: string): Promise<string> => {
    if (specified) {
      if (!(typeof scripts[specified] === 'string' && scripts[specified])) {
        throw new Error(`Script not found: ${specified}.`)
      }

      return scripts[specified]
    }

    const { command } = await gSel({}, { scripts: loader })('scripts')('Please select a script to run.')
    return command
  }

  const command = await tryGetScript(script)
  const [cli, ...params] = command.split(' ')
  await spawn(cli, params, { cwd: folder })
}

program
  .command('run [script]')
  .description('execute commands from the project.')
  .option('-p, --project <project>', 'specify the project to run npm-scripts.')
  .action((script: string, options?: CLIRunOptions) => intercept()(takeAction)(script, options))
