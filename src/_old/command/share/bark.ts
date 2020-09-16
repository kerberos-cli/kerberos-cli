import fs from 'fs-extra'
import { name, cwdPath } from '../../constants/conf'
import Cerberus from '../../libs/Cerberus'

export type Options = {
  cwd?: string
  config?: string
}

export default async function bark(options?: Options): Promise<Cerberus> {
  const { cwd = cwdPath, config } = options || {}
  if (!(cwd && await fs.pathExists(cwd) && (await fs.stat(cwd)).isDirectory())) {
    throw new Error(`Folder ${cwd} is not a ${name} project`)
  }

  return new Cerberus({ cwd, configFileName: config })
}
