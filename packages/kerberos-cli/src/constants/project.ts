import { $Keys } from 'utility-types'
import * as Types from '../types'

/** 配置文件的属性排序 */
export const configKeySequence: $Keys<Types.CConfig>[] = ['version', 'release', 'projects']
