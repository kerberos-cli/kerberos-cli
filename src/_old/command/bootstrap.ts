import { program } from 'commander'
import bark, { Options } from './share/bark'

export async function bootstrap (options?: Options) {
  const cerberus = await bark(options)
  await cerberus.digestProject()
  await cerberus.digestConfigFile()
  await cerberus.digestHosts()
  await cerberus.digest()
}

program
.command('bootstrap')
.description('Use NPM/YARN to install all hosts and soft-link itself to the host.')
.option('--cwd <cwd>', 'Configure base exec path.')
.option('-c, --config <config>', 'Configure config file name.')
.action((options: Options) => bootstrap(options))
