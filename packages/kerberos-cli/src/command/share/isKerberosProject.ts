import fs from 'fs-extra'
import path from 'path'
import { configFileName } from '../../constants/conf'

export default async function isKerberosProject(folder: string): Promise<boolean> {
  const cfg = path.join(folder, configFileName)
  const pkg = path.join(folder, 'package.json')
  if ((await fs.pathExists(cfg)) && (await fs.pathExists(pkg))) {
    if ((await fs.lstat(cfg)).isSymbolicLink() && (await fs.lstat(pkg)).isSymbolicLink()) {
      return true
    }
  }

  return false
}
