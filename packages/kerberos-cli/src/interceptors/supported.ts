import { PromiseType } from 'utility-types'
import { supportedYarn } from '../services/pm'
import { supportedGit } from '../services/git'
import i18n from '../i18n'

export default function supported<T extends (...args: any[]) => Promise<any>, A extends Parameters<T>, R extends PromiseType<ReturnType<T>>>(
  callback: T
): (...args: A) => Promise<R> {
  return async function (...args: A): Promise<R> {
    if (!(await supportedGit())) {
      throw new Error(i18n.INTERCEPTORS__SUPPORTED__ERROR_NOT_INSTALL_GIT``)
    }

    if (!(await supportedYarn())) {
      throw new Error(i18n.INTERCEPTORS__SUPPORTED__ERROR_NOT_INSTALL_YARN``)
    }

    return callback(...args)
  }
}
