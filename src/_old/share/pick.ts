/**
 * 获取对象指定属性
 * @param object 对象
 * @param keys 属性集合
 */
export default function pick<T extends { [key: string]: any }>(object: T, keys: Array<keyof T>): Pick<T, keyof T> {
  if (!Array.isArray(keys)) {
    return {} as any
  }

  return keys.reduce((obj, key: any) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key]
    }

    return obj
  }, {}) as any
}
