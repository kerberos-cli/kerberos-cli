import { ListQuestionOptions } from 'inquirer'
import { select, selectWithSearch } from '../../services/ui'
import i18n from '../../i18n'
import * as I18nTypes from '../../i18n/types'

/**
 * 如果未指定语言则提示选择
 * @param message 信息
 * @param specified 指定语言
 * @param initialOptions 选择器配置
 */
export default async function tryGetLanguage(
  message: string,
  specified?: I18nTypes.Language,
  initialOptions?: ListQuestionOptions,
  enableSearch: boolean = false
): Promise<I18nTypes.Language> {
  if (typeof specified === 'string') {
    if (-1 === i18n.supported.indexOf(specified)) {
      throw new Error(i18n.COMMAND_SHARE__TRY_GET_LANGUAGE__ERROR_NOT_FOUND_LANGUAGE`${specified}`)
    }

    return specified
  }

  const { value: language } = enableSearch ? await selectWithSearch('languages', initialOptions)(message) : await select('languages', initialOptions)(message)
  return language as I18nTypes.Language
}
