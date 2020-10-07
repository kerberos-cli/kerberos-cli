import { ListQuestionOptions } from 'inquirer'
import { getWorkspaceInfoCollection } from '../../services/project'
import { select } from '../../services/ui'
import i18n from '../../i18n'
import * as Types from '../../types'

/**
 * 如果未指定工作区则提示选择
 * @param message 信息
 * @param specified 指定工作区
 * @param initialOptions 选择器配置
 */
export default async function tryGetWrokspace(message: string, specified?: string, initialOptions?: ListQuestionOptions): Promise<Types.DWorkspace> {
  if (typeof specified === 'string') {
    const workspaces = await getWorkspaceInfoCollection()
    const index = workspaces.findIndex((item) => item.name === specified)
    if (-1 === index) {
      throw new Error(i18n.COMMAND_SHARE__TRY_GET_WORKSPACE__ERROR_NOT_FOUND_PROJECT`${specified}`)
    }

    return workspaces[index]
  }

  const workspace = await select('workspace', initialOptions)(message)
  return workspace
}
