import { getWorkspaces } from '../../services/project'
import { select } from '../../services/ui'

/**
 * 如果未指定工作区则提示选择
 * @param message 信息
 * @param wrokspace 工作区
 */
export default async function tryGetWrokspace(message: string, wrokspace?: string) {
  if (typeof wrokspace === 'string') {
    const workspaces = await getWorkspaces()
    const index = workspaces.findIndex(item => item.name === wrokspace)
    if (-1 === index) {
      throw new Error(`Project not found: ${wrokspace}`)
    }

    return workspaces[index]
  }

  const workspace = await select('workspace')(message)
  return workspace
}
