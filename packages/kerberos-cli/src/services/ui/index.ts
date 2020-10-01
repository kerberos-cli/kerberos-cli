import inquirer from 'inquirer'
import { PromiseType, ValuesType } from 'utility-types'
import commonCommands from '../../constants/command'
import * as SelectOptions from './selectOptions'
import i18n from '../../i18n'
import * as Types from '../../types'

/**
 * 创建单选UI
 * @param initialOptions 初始配置
 * @param choicesGenerator 选项生成器
 */
export function gSel<C, S extends Types.ChoicesGenerators<C>>(initialOptions: inquirer.ListQuestionOptions = {}, choicesGenerator: C = SelectOptions as any) {
  return function <
    /** 类型 */
    T extends keyof C,
    /** 函数 */
    F extends S[T] extends (...args: any[]) => any ? S[T] : never,
    /** 参数集 */
    A extends Parameters<F>,
    /** 结果集 */
    R extends ReturnType<F>,
    /** 真正返回值 */
    P extends R extends Promise<unknown> ? PromiseType<R> : R
  >(type: T) {
    return async function (message: string, ...args: A): Promise<ValuesType<P>> {
      const context = choicesGenerator[type]
      if (!(typeof context === 'function')) {
        throw new Error(i18n.UI__GSEL__ERROR_NOT_FOUND_SELECTOR`${type + ''}`)
      }

      const choices = await context(...args)
      if (!Array.isArray(choices)) {
        return
      }

      const { selected } = await inquirer.prompt({
        ...initialOptions,
        type: 'list',
        name: 'selected',
        message: message,
        choices: choices,
      })

      const choice = choices.find((item) => item.value === selected) || choices.find((item) => item.name === selected)
      return choice
    }
  }
}

/**
 * 创建多选UI
 * @param initialOptions 初始配置
 * @param choicesGenerator 选项生成器
 */
export function gMultiSel<C, S extends Types.ChoicesGenerators<C>>(initialOptions: inquirer.CheckboxQuestionOptions = {}, choicesGenerator: C = SelectOptions as any) {
  return function <
    /** 类型 */
    T extends keyof C,
    /** 函数 */
    F extends S[T] extends (...args: any[]) => any ? S[T] : never,
    /** 参数集 */
    A extends Parameters<F>,
    /** 结果集 */
    R extends ReturnType<F>,
    /** 真正返回值 */
    P extends R extends Promise<unknown> ? PromiseType<R> : R
  >(type: T) {
    return async function (message: string, ...args: A): Promise<P> {
      const context = choicesGenerator[type]
      if (!(typeof context === 'function')) {
        throw new Error(i18n.UI__G_MULTI_SEL__ERROR_NOT_FOUND_SELECTOR`${type + ''}`)
      }

      const choices = await context.call(null, message, ...args)
      if (!Array.isArray(choices)) {
        return
      }

      const { selected } = await inquirer.prompt({
        ...initialOptions,
        type: 'checkbox',
        name: 'selected',
        message: message,
        choices: choices,
      })

      return selected.map((value: string) => {
        return choices.find((item) => item.value === value) || choices.find((item) => item.name === value)
      })
    }
  }
}

/**
 * 单选
 * @param name 选择器名称
 */
export function select<T extends keyof typeof SelectOptions>(type: T, initialOptions?: inquirer.ListQuestionOptions) {
  return gSel(initialOptions, SelectOptions)(type)
}

/**
 * 多选
 * @param name 选择器名称
 */
export function multiSelect<T extends keyof typeof SelectOptions>(type: T, initialOptions?: inquirer.CheckboxQuestionOptions) {
  return gMultiSel(initialOptions, SelectOptions)(type)
}

/**
 * 确认提示
 * @param message 确认信息
 * @param defaultValue 默认值
 */
export async function confirm(message: string = i18n.UI__CONFIRM__DEFAULT_MESSAGE``, defaultValue: boolean = true): Promise<boolean> {
  const { value: selected } = await inquirer.prompt({
    type: 'confirm',
    name: 'value',
    message: message,
    default: defaultValue,
  })

  return selected
}

/**
 * 输入命令
 * @param message 输出信息
 */
export async function inputCommand(message: string = '>'): Promise<string> {
  const promptOptions = {
    type: 'command',
    name: 'command',
    message: message,
    autoCompletion: commonCommands,
  }

  const { command } = await inquirer.prompt(promptOptions as any)
  return command
}
