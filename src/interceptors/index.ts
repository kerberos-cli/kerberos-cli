import { PromiseType } from 'utility-types'
import tryAction from './tryAction'
import supported from './supported'
import context from './context'

const interceptors = {
  tryAction,
  supported,
  context,
}

/**
 * 拦截命令(默认使用全部)
 * @param useInterceptors 使用拦截器名称, 不填默认全开启
 * @param unuseInterceptors 不使用的拦截器名称, 不填默认不开启
 */
export default function intercept<
  /** 方法 */
  T extends (...args: any[]) => Promise<any>,
  /** 参数 */
  A extends Parameters<T>,
  /** 返回值 */
  R extends PromiseType<ReturnType<T>>
>(useInterceptors?: Array<keyof typeof interceptors>, unuseInterceptors?: Array<keyof typeof interceptors>): (callback: T) => (...args: A) => Promise<R> {
  let names = Object.keys(interceptors)
  if (Array.isArray(useInterceptors) && useInterceptors.length > 0) {
    names = names.filter((name: keyof typeof interceptors) => {
      return -1 !== useInterceptors.indexOf(name)
    })
  }

  if (Array.isArray(unuseInterceptors) && unuseInterceptors.length > 0) {
    names = names.filter((name: keyof typeof interceptors) => {
      return -1 === unuseInterceptors.indexOf(name)
    })
  }

  return function(callback: T) {
    return async function(...args: A): Promise<R> {
      let context = callback
      for (let i = 0; i < names.length; i++) {
        const name = names[i]
        const intercept = interceptors[name]
        context = intercept(context) as T
      }

      return context(...args)
    }
  }
}
