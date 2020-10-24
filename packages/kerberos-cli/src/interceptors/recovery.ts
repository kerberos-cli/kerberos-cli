import { PromiseType } from 'utility-types'
import { recovery } from '../services/actions'

/** 恢复 */
export default function recoveryInterceptor<T extends (...args: any[]) => Promise<any>, A extends Parameters<T>, R extends PromiseType<ReturnType<T>>>(
  callback: T
): (...args: A) => Promise<R> {
  return async function (...args: A): Promise<R> {
    recovery()
    return callback(...args)
  }
}
