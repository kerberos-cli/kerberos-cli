import { select } from '../../services/ui'

/**
 * 如果未指定工作区则提示选择
 * @param message 信息
 * @param scripts 脚本
 */
export default async function tryGetScript(message: string, scripts?: { [N: string]: string }, specified?: string): Promise<string> {
  if (specified) {
    if (!(typeof scripts[specified] === 'string' && scripts[specified])) {
      throw new Error(`Script not found: ${specified}.`)
    }

    return scripts[specified]
  }

  const { command } = await select('script')(message, scripts)
  return command
}
