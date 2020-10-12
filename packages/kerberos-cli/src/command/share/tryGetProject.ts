import { ListQuestionOptions } from 'inquirer'
import { getProjectInfoByName } from '../../services/project'
import { select, selectWithSearch } from '../../services/ui'
import i18n from '../../i18n'

/**
 * 如果未指定项目则提示选择
 * @param message 信息
 * @param specified 指定项目名称
 * @param initialOptions 选择器配置
 */
export default async function tryGetProject(message: string, specified?: string, initialOptions?: ListQuestionOptions, enableSearch: boolean = false) {
  if (typeof specified === 'string') {
    const project = await getProjectInfoByName(specified)
    if (!project) {
      throw new Error(i18n.COMMAND_SHARE__TRY_GET_PROJECT__ERROR_NOT_FOUND_BRANCH`${specified}`)
    }

    return project
  }

  const project = enableSearch ? await selectWithSearch('project', initialOptions)(message) : await select('project', initialOptions)(message)
  return project
}
