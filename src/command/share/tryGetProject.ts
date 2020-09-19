import { getProject } from '../../services/project'
import { selectProject } from '../../services/ui'

/**
 * 如果未指定项目则提示选择
 * @param message 信息
 * @param name 项目名称
 */
export default async function tryGetProject(message: string, name?: string) {
  if (typeof name === 'string') {
    const project = await getProject(name)
    if (!project) {
      throw new Error(`Project not found: ${name}`)
    }

    return project
  }

  const project = await selectProject(message)
  return project
}
