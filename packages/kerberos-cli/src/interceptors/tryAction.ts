import { PromiseType } from 'utility-types'
import { fail } from '../services/logger'

export default function tryAction<T extends (...args: any[]) => Promise<any>, A extends Parameters<T>, R extends PromiseType<ReturnType<T>>>(
  callback: T
): (...args: A) => Promise<R> {
  return async function (...args: A): Promise<R> {
    try {
      return await callback(...args)
    } catch (error) {
      fail(error)
    }
  }
}
