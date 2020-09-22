import fs from 'fs-extra'
import path from 'path'
import { program } from 'commander'
import isEqual from 'lodash/isEqual'
import { getConfig } from '../services/project'
import { spawn } from '../services/process'
import { success } from '../services/logger'
import { confirm, multiSelect } from '../services/ui'
import intercept from '../interceptors'
import * as Types from '../types'

async function takeAction(options?: Types.CLIBootstrapOptions): Promise<void> {
  const { yes, optional } = options
  const config = await getConfig()
  const pkgFile = path.join(process.cwd(), 'package.json')
  if (!(await fs.pathExists(pkgFile))) {
    throw new Error('package.json is invalid.')
  }

  // 重写 package.json
  const pkgSource = await fs.readJSON(pkgFile)
  if (!(pkgSource.private === true && isEqual(pkgSource.workspaces, config?.workspaces))) {
    pkgSource.workspaces = config?.workspaces || []
    pkgSource.private = true

    const finalSource = JSON.stringify(pkgSource, null, 2)
    await fs.writeFile(pkgFile, finalSource)
  }

  // 克隆所有仓库
  const projects = config?.projects || []
  const noExistsProjectFlags = await Promise.all(
    projects.map(async ({ name, workspace }) => {
      const wsFolder = path.join(process.cwd(), workspace)
      const pjFolder = path.join(wsFolder, name)
      const exists = await fs.pathExists(pjFolder)
      return !exists
    })
  )

  const necessaries: Types.CProject[] = []
  const optionals: Types.CProject[] = []
  const codes: number[] = []
  const install = (projects: Types.DProjectInConfChoice[]) => {
    return projects.map(({ name, workspace, repository }) => {
      const wsFolder = path.join(process.cwd(), workspace)
      return spawn('git', ['clone', repository, name], { cwd: wsFolder })
    })
  }

  projects.forEach((project, index) => {
    if (noExistsProjectFlags[index]) {
      if (project.optional === true) {
        optionals.push(project)
      } else {
        necessaries.push(project)
      }
    }
  })

  // 安装依赖
  const nCodes = await Promise.all(install(necessaries))
  codes.push(...nCodes)

  if (optionals.length > 0) {
    if (yes) {
      if (optional) {
        const oCodes = await Promise.all(install(optionals))
        codes.push(...oCodes)
      }
    } else {
      if (await confirm('It was found that some optional items were not installed. Do I need to install these items?', false)) {
        const selectedProjects = await multiSelect('projectInConfig')('Please select the project to clone.', optionals)
        const oCodes = await Promise.all(install(selectedProjects))
        codes.push(...oCodes)
      }
    }
  }

  // 操作结果
  if (codes.filter(code => code === 0).length === 0) {
    if (!(await spawn('yarn'))) {
      success('bootstrap has been completed.')
    }
  }
}

program
  .command('bootstrap')
  .description('initialize yarn workspace and install depedencies of all projects')
  .option('-y, --yes [yes]', 'skip all questions')
  .option('-o, --optional [optional]', 'specify to install all optional dependencies when specifying the --yes option')
  .action((options: Types.CLIBootstrapOptions) => intercept()(takeAction)(options))
