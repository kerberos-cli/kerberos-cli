import { program } from 'commander'
import { spawn } from '../services/process'
import { success } from '../services/logger'
import tryGetProjects from './share/tryGetProjects'
import intercept from '../interceptors'
import { getBranch, getBranches } from '../services/git'
import { getDirtyProjectInfoCollection } from '../services/project'
import i18n from '../i18n'
import * as Types from '../types'
import chalk from 'chalk'

async function takeAction(branch: string, options?: Types.CLICheckoutOptions) {
  const projects = await tryGetProjects(i18n.COMMAND__CHECKOUT__SELECT_PROJECT``, options.projects)
  if (projects.length === 0) {
    return
  }

  // 检测是否文件改动未提交
  const dirtyProjects = await getDirtyProjectInfoCollection()
  if (dirtyProjects.length > 0 && -1 !== dirtyProjects.findIndex((item) => -1 !== projects.findIndex((project) => project.name === item.name))) {
    const names = dirtyProjects.map((item: { name: string; version: string; folder: string }) => item.name)
    throw new Error(i18n.COMMAND__CHECKOUT__ERROR_NOT_SUBMIT`\n${names.map((name) => ` - ${name} `).join('  \n')}`)
  }

  // 切换分支
  const result = await Promise.all(
    projects.map(async ({ name, folder }) => {
      const current = await getBranch(folder)
      if (current === branch) {
        return { name, code: 0 }
      }

      const { locals } = await getBranches(folder)
      const params = ['checkout']
      if (locals.indexOf(branch) === -1) {
        params.push('-b')
      }

      const code = await spawn('git', [...params, branch], { cwd: folder })
      return { name, code }
    })
  )

  const failedProjects = result.filter(({ code }) => code !== 0)
  if (failedProjects.length > 0) {
    throw new Error(i18n.COMMAND__CHECKOUT__ERROR_FAIL_CHECKOUT`${failedProjects.map(({ name }) => chalk.white(name)).join(', ')}`)
  }

  success(i18n.COMMAND__CHECKOUT__SUCCESS_COMPLETE`${branch}`)
}

program
  .command('checkout <branch>')
  .description(i18n.COMMAND__CHECKOUT__DESC``)
  .option('-p, --project <projects...>', i18n.COMMAND__CHECKOUT__OPTION_PROJECT``)
  .action((branch: string, options?: Types.CLICheckoutOptions) => intercept()(takeAction)(branch, options))
