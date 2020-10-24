import { PromiseType } from 'utility-types'
import { recovery } from '../services/actions'
import { fail } from '../services/logger'

/**
 * 捕抓错误
 * @description
 * 提供更加友好的错误提示
 */
export default function tryActionInterceptor<T extends (...args: any[]) => Promise<any>, A extends Parameters<T>, R extends PromiseType<ReturnType<T>>>(
  callback: T
): (...args: A) => Promise<R> {
  return async function (...args: A): Promise<R> {
    try {
      return await callback(...args)
    } catch (error) {
      recovery()
      fail(error)

      throw error
    }
  }
}
