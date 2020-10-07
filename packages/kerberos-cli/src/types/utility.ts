/** 获取集合中所有键值 */
export type KeyOfUnion<U> = U extends object ? keyof U : never
