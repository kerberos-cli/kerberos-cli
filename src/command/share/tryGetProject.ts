import { getProject } from '../../services/project'
import { select } from '../../services/ui'

/**
 * 如果未指定项目则提示选择
 * @param message 信息
 * @param name 项目名称
 */
export default async function tryGetProject(message: string, specified?: string) {
  if (typeof specified === 'string') {
    const project = await getProject(specified)
    if (!project) {
      throw new Error(`Project not found: ${specified}`)
    }

    return project
  }

  const project = await select('project')(message)
  return project
}
