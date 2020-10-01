import inquirer from 'inquirer'
import { getProjectInfoByName } from '../../services/project'
import { select } from '../../services/ui'
import i18n from '../../i18n'

/**
 * 如果未指定项目则提示选择
 * @param message 信息
 * @param name 项目名称
 */
export default async function tryGetProject(message: string, specified?: string, initialOptions?: inquirer.ListQuestionOptions) {
  if (typeof specified === 'string') {
    const project = await getProjectInfoByName(specified)
    if (!project) {
      throw new Error(i18n.COMMAND_SHARE__TRY_GET_PROJECT__ERROR_NOT_FOUND_BRANCH`${specified}`)
    }

    return project
  }

  const project = await select('project', initialOptions)(message)
  return project
}
