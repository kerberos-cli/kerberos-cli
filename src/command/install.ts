import fs from 'fs-extra'
import path from 'path'
import { program } from 'commander'
import { confirm } from '../services/ui'
import { configFile, configProjectFolderName, configTemplate } from '../constants/config'
import intercept from '../interceptors'
import * as Types from '../types'

async function takeAction(): Promise<void> {
  const cwd = process.cwd()
  const cfg = path.join(cwd, configFile)
  const pkg = path.join(cwd, 'package.json')
  if (!(await fs.pathExists(cfg)) || (await fs.lstat(cfg)).isSymbolicLink()) {
    throw new Error(`The file ${configFile} is a soft link and cannot be installed`)
  }

  if (!(await fs.pathExists(pkg))) {
    throw new Error('The file package.json is not found')
  }

  const config: Types.CConfig = await fs.readJSON(cfg)
  const source: Types.DProject['package'] = await fs.readJSON(pkg)
  const project = config.projects.find(item => item.name === source.name)
  if (!project) {
    throw new Error(`The settings of this project could not be found in the ${configFile}`)
  }

  const { workspace } = project || {}
  if (!(typeof workspace === 'string' && workspace.length > 0)) {
    throw new Error(`Workspace configuration setting error in the ${configFile}`)
  }

  if (!(await confirm('This action will move your files, are you sure you want to perform this action?'))) {
    return
  }

  // 移动文件
  const files = (await fs.readdir(cwd)).filter(file => {
    const relative = path.relative(cwd, file)
    return !/node_modules/.test(relative)
  })

  const dest = path.join(cwd, workspace, configProjectFolderName)
  await fs.ensureDir(path.dirname(dest))

  await Promise.all(
    files.map(file => {
      const name = path.basename(file)
      const target = path.join(dest, name)
      return fs.move(file, target)
    })
  )

  // 重写 package.json
  const wsPkg = path.join(configTemplate, 'package.json')
  const wsPkgJson: Types.DProject['package'] = await fs.readJSON(wsPkg)
  wsPkgJson.workspaces = config.workspaces
  wsPkgJson.private = true

  await fs.writeFile(path.join(cwd, 'package.json'), JSON.stringify(wsPkgJson, null, 2))

  // 创建配置软链
  await fs.symlink(path.join(dest, 'kerberos.json'), path.join(cwd, 'kerberos.json'))
}

program
  .command('install')
  .description('execute project script')
  .action(() => intercept()(takeAction)())
