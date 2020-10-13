import fs from 'fs-extra'
import path from 'path'
import { configFileName, workspacePackageFileName } from '../../constants/conf'

export default async function isDogeProject(folder: string): Promise<boolean> {
  const cfg = path.join(folder, configFileName)
  const pkg = path.join(folder, 'package.json')
  const wkg = path.join(folder, workspacePackageFileName)
  return (await fs.pathExists(cfg)) && (await fs.pathExists(pkg)) && (await fs.pathExists(wkg))
}
