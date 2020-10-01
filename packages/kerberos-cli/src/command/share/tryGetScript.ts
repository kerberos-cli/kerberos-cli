import { select } from '../../services/ui'
import i18n from '../../i18n'

/**
 * 如果未指定工作区则提示选择
 * @param message 信息
 * @param scripts 脚本
 */
export default async function tryGetScript(message: string, scripts?: { [N: string]: string }, specified?: string): Promise<string> {
  if (specified) {
    if (!(typeof scripts[specified] === 'string' && scripts[specified])) {
      throw new Error(i18n.COMMAND_SHARE__TRY_GET_SCRIPT__ERROR_NOT_FOUND_SCRIPT`${specified}.`)
    }

    return scripts[specified]
  }

  const { name } = await select('script')(message, scripts)
  return name
}
