import { PromiseType } from 'utility-types'
import tryAction from './tryAction'
import branch from './branch'
import supported from './supported'
import context from './context'

/** 拦截器集合 */
const interceptors = {
  tryAction,
  supported,
  /** 注意 context 应该最早执行, 需要放最底下 */
  context,
}

/** 不使用的拦截器集合 */
const unusedInterceptors = {
  branch,
}

/** 全部拦截器集合 */
const allInterceptors = {
  ...interceptors,
  ...unusedInterceptors,
}

/** 拦截器类型 */
type InterceptorTypes = keyof typeof allInterceptors

/**
 * 拦截命令(默认使用全部)
 * @description
 * 注意顺序, 越后越早执行,
 * 因为越早执行会按顺序返回回调函数,
 * 而回调函数则是反过来执行:
 * a(b() => bCallback) => aCallback;
 * bCallback() -> aCallback();
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
>(
  useInterceptors?: InterceptorTypes[] | '*',
  unuseInterceptors?: InterceptorTypes[] | '*',
  additionInterceptors?: InterceptorTypes[]
): (callback: T) => (...args: A) => Promise<R> {
  const names = Object.keys(allInterceptors)
  const used = []

  if (Array.isArray(useInterceptors)) {
    useInterceptors.forEach((name) => {
      const index = names.indexOf(name)
      index !== -1 && used.push(name)
    })
  } else if (useInterceptors === '*') {
    used.push(...Object.keys(allInterceptors))
  } else {
    used.push(...Object.keys(interceptors))
  }

  if (used.length > 0) {
    if (Array.isArray(unuseInterceptors)) {
      unuseInterceptors.forEach((name) => {
        const index = used.indexOf(name)
        index !== -1 && used.splice(index, 1)
      })
    } else if (unuseInterceptors === '*') {
      used.splice(0)
    }
  }

  if (Array.isArray(additionInterceptors)) {
    additionInterceptors.forEach((name) => {
      const index = names.indexOf(name)
      index !== -1 && used.push(name)
    })
  }

  return function (callback: T) {
    return async function (...args: A): Promise<R> {
      let context = callback
      for (let i = 0; i < used.length; i++) {
        const name = used[i]
        const intercept = allInterceptors[name]
        context = intercept(context) as T
      }

      return context(...args)
    }
  }
}
