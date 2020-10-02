import chalk from 'chalk'
import uniq from 'lodash/uniq'
import groupBy from 'lodash/groupBy'
import { program } from 'commander'
import { getConfigInfo, getDirtyProjectInfoCollection } from '../services/project'
import intercept from '../interceptors'
import tryGetProjects from './share/tryGetProjects'
import { getBranch } from '../services/git'
import { confirm } from '../services/ui'
import { randomHex } from '../services/logger'
import i18n from '../i18n'

async function takeAction() {
  const configs = await getConfigInfo()
  const releaseBranch = configs?.release?.branch

  const projects = await tryGetProjects(i18n.COMMAND__TAG__SELECT_PROJECTS``)
  const branches = await Promise.all(
    projects.map(async (project) => {
      const { name, folder } = project
      const branch = await getBranch(folder)
      return { name, branch }
    })
  )

  // 检测是否文件改动未提交
  const dirtyProjects = await getDirtyProjectInfoCollection()
  if (dirtyProjects.length > 0 && -1 !== dirtyProjects.findIndex((item) => -1 !== projects.findIndex((project) => project.name === item.name))) {
    const names = dirtyProjects.map((item: { name: string; version: string; folder: string }) => item.name)
    throw new Error(i18n.COMMAND__TAG__ERROR_NOT_SUBMIT`\n${names.map((name) => ` - ${name} `).join('  \n')}`)
  }

  // 配置发布分支, 检测分支是否都在发布分支
  if (releaseBranch) {
    const projects = branches.filter(({ branch }) => branch !== releaseBranch)
    if (projects.length > 0) {
      const message = i18n.COMMAND__TAG__ERROR_RELEASE_BRANCH`${projects.map(({ name }) => chalk.white(name)).join(', ')} ${chalk.white(releaseBranch)}`
      throw new Error(message)
    }
  } else {
    // 检测是否都在相同的分支中
    const diff = uniq(branches.map((project) => project.branch))
    if (diff.length > 0) {
      const group = groupBy(branches, 'branch')
      const colors = {}
      Object.keys(group).forEach((branch) => (colors[branch] = randomHex()))

      const status = branches.map(({ name, branch }) => chalk.gray(` - ${chalk.white(name)} >> ${chalk.hex(colors[branch])(branch)}`)).join('\n')
      if (!(await confirm(i18n.COMMAND__TAG__CONFIRM_DIFF_BRANCHES`${status}`))) {
        return
      }
    }
  }

  console.log(
    projects.map((item) => ({
      name: `${item.name}@${item.version}`,
    }))
  )

  // inquirer.prompt({
  //   type: 'input',
  //   name: 'tag',
  // })
}

program
  .command('tag')
  .description(i18n.COMMAND__TAG__DESC``)
  .action(() => intercept()(takeAction)())
  .helpOption('-h, --help', i18n.COMMAND__OPTION__HELP_DESC``)
