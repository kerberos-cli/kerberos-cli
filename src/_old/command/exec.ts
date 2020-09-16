import { program } from 'commander'
import bark, { Options } from './share/bark'

export type ExecOptions = Options & {
}

export async function exec(command: string, params: string[], options?: Options) {
  const cerberus = await bark(options)
  await cerberus.digestProject()
  await cerberus.digestConfigFile()
  await cerberus.exec(command, params)
}

program
.command('exec <command> [params...]')
.description('Exec hosts script')
// .option('--package-manager <pm>', 'Configure package manager.')
.option('--cwd <cwd>', 'Configure base exec path.')
.option('-c, --config <config>', 'Configure config file name.')
.action((command, params, options) => exec(command, params, options))
