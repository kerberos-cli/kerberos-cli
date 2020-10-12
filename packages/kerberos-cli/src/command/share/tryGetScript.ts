import { ListQuestionOptions } from 'inquirer'
import { select, selectWithSearch } from '../../services/ui'
import i18n from '../../i18n'

/**
 * 如果未指定工作区则提示选择
 * @param message 信息
 * @param scripts 指定候选脚本
 * @param specified 指定脚本名称
 * @param initialOptions 选择器配置
 */
export default async function tryGetScript(
  message: string,
  scripts?: { [N: string]: string },
  specified?: string,
  initialOptions?: ListQuestionOptions,
  enableSearch: boolean = false
): Promise<{ name: string; command: string }> {
  if (specified) {
    if (!(typeof scripts[specified] === 'string' && scripts[specified])) {
      throw new Error(i18n.COMMAND_SHARE__TRY_GET_SCRIPT__ERROR_NOT_FOUND_SCRIPT`${specified}.`)
    }

    const command = scripts[specified]
    return { name: specified, command }
  }

  const script = enableSearch ? await selectWithSearch('script', initialOptions)(message, scripts) : await select('script', initialOptions)(message, scripts)
  return script
}
