// import { program } from 'commander'
// import { spawn } from '../services/process'
// import { getDependencyWeight } from '../services/pm'
// import intercept from '../interceptors'
// import { multiSelect } from '../services/ui'

// type CLIRunOptions = {
//   project?: string
// }

// async function takeAction(script: string, options?: CLIRunOptions): Promise<void> {
//   const projects = await multiSelect('project')('Please select projects.')
//   // projects.map(item => )

//   // const command = await tryGetScript(script)
//   // const [cli, ...params] = command.split(' ')
//   // await spawn(cli, params, { cwd: folder })
// }

// program
//   .command('multi-run <script>')
//   .description('execute project script')
//   .action((script: string, options?: CLIRunOptions) => intercept()(takeAction)(script, options))
