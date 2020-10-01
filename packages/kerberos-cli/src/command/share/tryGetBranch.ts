import { getBranch, getBranchNames } from '../../services/git'
import { select } from '../../services/ui'
import i18n from '../../i18n'

/**
 * 如果未指定分支则提示选择
 * @param message 信息
 * @param name 分支名称
 */
export default async function tryGetBranch(message: string, folder: string, specified?: string) {
  if (typeof specified === 'string') {
    const branches = await getBranchNames(folder)
    if (-1 === branches.indexOf(specified)) {
      throw new Error(i18n.COMMAND_SHARE__TRY_GET_BRANCH__ERROR_NOT_FOUND_BRANCH`${specified}`)
    }

    return specified
  }

  const current = await getBranch(folder)
  const { name: branch } = await select('branch')(i18n.COMMAND_SHARE__TRY_GET_BRANCH__SELECT_BRANCH`${message} ${current}`, folder)
  return branch
}
