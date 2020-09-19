import { getBranch, getBranchNames } from '../../services/git'
import { selectBranch } from '../../services/ui'

/**
 * 如果未指定分支则提示选择
 * @param message 信息
 * @param name 分支名称
 */
export default async function tryGetBranch(message: string, folder: string, name?: string) {
  if (typeof name === 'string') {
    const branches = await getBranchNames(folder)
    if (-1 === branches.indexOf(name)) {
      throw new Error(`Branch not found: ${name}`)
    }

    return name
  }

  const current = await getBranch(folder)
  const branch = await selectBranch(`${message} (Cur Branch: ${current})`, folder)
  return branch
}
