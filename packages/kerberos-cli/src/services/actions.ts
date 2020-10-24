import fs from 'fs-extra'
import path from 'path'
import { getProjectInfoCollection } from './project'
import { backupPackageFileName } from '../constants/conf'

export async function recovery(): Promise<void> {
  const projects = await getProjectInfoCollection()
  await Promise.all(
    projects.map(async ({ folder }) => {
      const bak = path.join(folder, backupPackageFileName)
      if (await fs.pathExists(bak)) {
        const pkg = path.join(folder, 'package.json')
        await fs.move(bak, pkg, { overwrite: true })
      }
    })
  )
}
