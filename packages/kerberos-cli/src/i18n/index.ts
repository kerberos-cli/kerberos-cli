import camelCase from 'lodash/camelCase'
import * as zhCN from './zh-CN'
import * as enUS from './en-US'
import * as Types from '../types'
import { ValuesType, Assign } from 'utility-types'

function mix<
  /** 传入值 */
  LL extends Record<string, any>,
  /** 'zhCN' | 'enUS' */
  LNK extends keyof LL,
  /** typeof zhCN | typeof enUS */
  LVU extends ValuesType<LL>,
  /** 获取所有键值 */
  LKA extends Types.KeyOfUnion<LVU>,
  /** 未赋值均为 nerver */
  LVF extends { [P in LNK]: Assign<{ [K in LKA]: never }, { [K in keyof LL[P]]: (_: TemplateStringsArray, ...replacers: string[]) => LL[P][K] }> },
  /** 结果集合 */
  LRU extends ValuesType<LVF>
>(languages: LL): LRU {
  const env = process.env
  const lang = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE
  const [userLanguage] = lang.split('.')

  const keys = []
  const descriptors = {}
  const i18n: LRU = {} as LRU
  const names = Object.keys(languages)
  const allCamelCasedNames = names.map((name) => camelCase(name))
  names.forEach((name) => keys.push(...Object.keys(languages[name])))

  const userCamelCasedName = camelCase(userLanguage)
  const index = allCamelCasedNames.indexOf(userCamelCasedName)
  const usedName = names[index] || 'enUS'
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

        return (_: TemplateStringsArray, ...replacers: string[]) => {
          for (let i = 0; i < replacers.length; i++) {
            message = message.replace(new RegExp(`#\\{${i + 1}\\}`, 'g'), replacers[i])
          }

          return message
        }
      },
    }
  })

  Object.defineProperties(i18n, descriptors)
  Object.assign(i18n, {
    toString: () => JSON.stringify(usedLanguage, null, 2),
    toJSON: () => usedLanguage,
  })

  return i18n
}

/** 顺序: 当某种语言找不到键值的时候, 越靠前越优先被顶替 */
export default mix({ enUS, zhCN })
