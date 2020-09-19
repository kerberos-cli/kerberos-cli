import { PromiseType } from 'utility-types'
import { supportedYarn } from '../services/pm'
import { supportedGit } from '../services/git'

export default function supported<T extends (...args: any[]) => Promise<any>, A extends Parameters<T>, R extends PromiseType<ReturnType<T>>>(
  callback: T
): (...args: A) => Promise<R> {
  return async function(...args: A): Promise<R> {
    if (!(await supportedGit())) {
      throw new Error('Git is not supported, please install Git first.')
    }

    if (!(await supportedYarn())) {
      throw new Error('Yarn is not supported, please enter `npm i -g yarn` first.')
    }

    return callback(...args)
  }
}
