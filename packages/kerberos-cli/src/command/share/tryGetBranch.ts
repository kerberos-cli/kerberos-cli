import { getBranch, getBranchNames } from '../../services/git'
import { select } from '../../services/ui'

/**
 * 如果未指定分支则提示选择
 * @param message 信息
 * @param name 分支名称
 */
export default async function tryGetBranch(message: string, folder: string, specified?: string) {
  if (typeof specified === 'string') {
    const branches = await getBranchNames(folder)
    if (-1 === branches.indexOf(specified)) {
      throw new Error(`Branch not found: ${specified}`)
    }

    return specified
  }

  const current = await getBranch(folder)
  const { name: branch } = await select('branch')(`${message} (Cur Branch: ${current})`, folder)
  return branch
}