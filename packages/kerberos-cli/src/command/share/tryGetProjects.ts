import { CheckboxQuestionOptions } from 'inquirer'
import { getProjectInfoByName } from '../../services/project'
import { multiSelect } from '../../services/ui'
import i18n from '../../i18n'

/**
 * 如果未指定项目则提示选择
 * @param message 信息
 * @param specified 指定子项目名称
 * @param initialOptions 选择器配置
 */
export default async function tryGetProjects(message: string, specified?: string[], initialOptions?: CheckboxQuestionOptions) {
  if (Array.isArray(specified)) {
    const projects = await Promise.all(
      specified.map(async (name) => {
        if (typeof name === 'string') {
          const project = await getProjectInfoByName(name)
          return project
        }

        return null
      })
    )

    const finalProjects = projects.filter(Boolean)
    if (finalProjects.length === 0) {
      throw new Error(i18n.COMMAND_SHARE__TRY_GET_PROJECTS__ERROR_NO_MATCH_PROJECTS``)
    }

    return finalProjects
  }

  const project = await multiSelect('project', initialOptions)(message)
  return project
}
