/** 一维依赖列表 */
export type FlattenDependencyList = {
  name: string
  dependencies?: string[]
}[]

/** 选项生成器 */
export type ChoicesGenerator = (...args: any[]) => any

/** 选项生成器集合 */
export type ChoicesGenerators<C> = {
  [N in keyof C]: C[N] extends ChoicesGenerator ? C[N] : never
}
