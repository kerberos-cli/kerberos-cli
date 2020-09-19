import { promisify } from 'util'
import commandExists from 'command-exists'

export async function supportedYarn(): Promise<boolean> {
  return await promisify(commandExists)('yarn')
}
