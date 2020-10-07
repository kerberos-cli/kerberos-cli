import i18n from '../i18n'
import { ValuesType } from 'utility-types'

/** 语言 */
export type Languages = typeof i18n.supported

/** 语言项目 */
export type Language = ValuesType<Languages>

/** 在配置中的项目选项 */
export type DLanguageChoice = {
  /** 语言显示 */
  name: string
  /** 语言值 */
  value: Language
}
