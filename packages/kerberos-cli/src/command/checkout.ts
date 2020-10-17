import chalk from 'chalk'
import { program } from 'commander'
import { success } from '../services/logger'
import intercept from '../interceptors'
import { getBranch, gitCheckout } from '../services/git'
import { getDirtyProjectInfoCollection, getProjectInfoCollection } from '../services/project'
import i18n from '../i18n'

async function takeAction(branch: string) {
  const projects = await getProjectInfoCollection()
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
        return false
      }

      if (!(await gitCheckout(branch, folder))) {
        return name
      }

      return false
    })
  )

  const failedProjects = result.filter(Boolean)
  if (failedProjects.length > 0) {
    throw new Error(i18n.COMMAND__CHECKOUT__ERROR_FAIL_CHECKOUT`${failedProjects.map((name) => chalk.white(name)).join(', ')}`)
  }

  success(i18n.COMMAND__CHECKOUT__SUCCESS_COMPLETE`${branch}`)
}

program
  .command('checkout <branch>')
  .description(i18n.COMMAND__CHECKOUT__DESC``, {
    branch: i18n.COMMAND__CHECKOUT__ARGS_BRANCH``,
  })
  .action((branch: string) => intercept()(takeAction)(branch))
