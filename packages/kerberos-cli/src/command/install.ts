import fs from 'fs-extra'
import path from 'path'
import { program } from 'commander'
import { confirm } from '../services/ui'
import { configFileName, packageFileName, configProjectFolderName } from '../constants/conf'
import intercept from '../interceptors'
import i18n from '../i18n'
import * as Types from '../types'

async function takeAction(): Promise<void> {
  const cwd = process.cwd()
  const cfg = path.join(cwd, configFileName)
  const pkg = path.join(cwd, 'package.json')
  if (!(await fs.pathExists(cfg)) || (await fs.lstat(cfg)).isSymbolicLink()) {
    throw new Error(i18n.COMMAND__INSTALL__ERROR_SOFT_LINK`${configFileName}`)
  }

  if (!(await fs.pathExists(pkg))) {
    throw new Error(i18n.COMMAND__INSTALL__ERROR_NO_PACKAGE``)
  }

  const config: Types.CConfig = await fs.readJSON(cfg)
  const source: Types.CPackage = await fs.readJSON(pkg)
  const project = config.projects.find((item) => item.name === source.name)
  if (!project) {
    throw new Error(i18n.COMMAND__INSTALL__ERROR_NO_SETTINGS`${configFileName}`)
  }

  const { workspace } = project || {}
  if (!(typeof workspace === 'string' && workspace.length > 0)) {
    throw new Error(i18n.COMMAND__INSTALL__ERROR_INVALID_SETTINGS`${configFileName}`)
  }

  if (!(await confirm(i18n.COMMAND__INSTALL__CONFIRM_MOVE_FILES``))) {
    return
  }

  // 移动文件
  const files = (await fs.readdir(cwd)).filter((file) => {
    const relative = path.relative(cwd, file)
    return !/node_modules/.test(relative)
  })

  const dest = path.join(cwd, workspace, configProjectFolderName)
  await fs.ensureDir(path.dirname(dest))

  await Promise.all(
    files.map((file) => {
      const name = path.basename(file)
      const target = path.join(dest, name)
      return fs.move(file, target)
    })
  )

  // 创建配置软链
  await fs.symlink(path.join(dest, configFileName), path.join(cwd, configFileName))
  await fs.symlink(path.join(dest, packageFileName), path.join(cwd, 'package.json'))
}

program
  .command('install')
  .description(i18n.COMMAND__INSTALL__DESC``)
  .action(() => intercept(['tryAction', 'supported', 'context'])(takeAction)())
  .helpOption('-h, --help', i18n.COMMAND__OPTION__HELP_DESC``)
