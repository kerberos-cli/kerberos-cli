import camelCase from 'lodash/camelCase'
import * as zhCN from './zh-CN'
import * as enUS from './en-US'
import { getVariables, updateVariables } from '../services/env'
import * as Types from '../types'
import { ValuesType, Assign, $Keys } from 'utility-types'

/* eslint-disable-next-line @typescript-eslint/no-use-before-define */
type Language = $Keys<typeof languages>

/** 顺序: 当某种语言找不到键值的时候, 越靠前越优先被顶替 */
export const languages = { 'en-US': enUS, 'zh-CN': zhCN }

/**
 * 设置语言
 * @param language 语言
 */
export function setLanguage(language: Language): boolean {
  if (languages[language]) {
    updateVariables({ language })
    return true
  }

  return false
}

/** 获取当前使用的语言信息 */
export function getCurrent(): ValuesType<typeof languages> {
  const { language = Object.keys(languages)[0] } = getVariables() || {}
  return languages[language]
}

/**
 * 混淆国际化
 * @param languages 各种语言的模板集合
 */
export function mix<
  /** 传入值 */
  LL extends Record<string, any>,
  /** 'zhCN' | 'enUS' */
  LNK extends keyof LL,
  /** typeof zhCN | typeof enUS */
  LVU extends ValuesType<LL>,
  /** 获取所有键值 */
  LKA extends Types.KeyOfUnion<LVU>,
  /** 未赋值均为 nerver */
  LVF extends {
    [P in LNK]: Assign<
      {
        [K in LKA]: never
      },
      {
        [K in keyof LL[P]]: ((_: TemplateStringsArray, ...replacers: string[]) => string) & {
          toString: LL[P][K]
          source: LL[P][K]
        }
      }
    >
  },
  /** 结果集合 */
  LRU extends ValuesType<LVF> & {
    supported: $Keys<LL>[]
  }
>(languages: LL): LRU {
  const env = process.env
  const lang = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE || 'en_US.UTF-8'
  const [userLanguage] = lang.split('.')

  const keys = []
  const descriptors: PropertyDescriptorMap = {}
  const i18n: LRU = {} as LRU
  const names = Object.keys(languages)
  const allCamelCasedNames = names.map((name) => camelCase(name))
  names.forEach((name) => keys.push(...Object.keys(languages[name])))

  const language = getVariables()?.language || userLanguage
  const userCamelCasedName = camelCase(language)
  const index = allCamelCasedNames.indexOf(userCamelCasedName)
  const usedName = names[index] || names[0]
  const usedLanguage = languages[usedName]

  keys.forEach((key) => {
    if (descriptors[key]) {
      return
    }

    descriptors[key] = {
      get() {
        let message = usedLanguage[key]

        // 当该语言没有被翻译, 则自动使用其他语言代替
        if (!message) {
          const name = Object.keys(languages).find((name) => typeof languages[name][key] === 'string')
          message = languages[name][key]
        }

        const translate = (_: TemplateStringsArray, ...replacers: string[]): string => {
          for (let i = 0; i < replacers.length; i++) {
            message = message.replace(new RegExp(`#\\{${i + 1}\\}`, 'g'), replacers[i])
          }

          return message
        }

        translate.source = message
        translate.toString = () => message
        translate.toJSON = () => message

        return translate
      },
    }
  })

  descriptors.supported = {
    get() {
      return names
    },
  }

  descriptors.supported = {
    get() {
      return names
    },
  }

  Object.defineProperties(i18n, descriptors)
  return i18n
}

/** 国际化模板 */
export default mix(languages)
