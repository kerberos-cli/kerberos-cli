import isPlainObject from 'lodash/isPlainObject'

/**
 * 根据序列重排对象属性
 * @param source 数据
 * @param getSequence 获取排列顺序, 作为函数主要兼容都层级数据
 * @param deep 是否为深度排序
 * @description
 * 主要用于 JSON.stringify 输出使用
 * namespaces 主要用于字段层层传递来确认位置
 */
export function sequence<T extends Record<string, any>>(source: T, getSequence?: (...namespace: string[]) => string[], deep: boolean = false): T {
  const { hasOwnProperty } = Object.prototype
  const object = {} as any

  const keys = getSequence()
  if (!Array.isArray(keys)) {
    return source
  }

  keys.forEach((name: string) => {
    if (hasOwnProperty.call(source, name)) {
      if (deep === true && isPlainObject(source[name])) {
        object[name] = sequence(source[name], getSequence.bind(name))
      } else {
        object[name] = source[name]
      }
    }
  })

  return object
}
