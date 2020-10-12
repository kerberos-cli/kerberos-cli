import chalk from 'chalk'
import { upperFirst } from 'lodash'
import inquirer from 'inquirer'
import semver, { ReleaseType } from 'semver'
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
export function gSel<C, S extends Types.ChoicesGenerators<C>>(
  promptType: 'list' | 'search-list' = 'list',
  initialOptions: inquirer.ListQuestionOptions = {},
  choicesGenerator: C = SelectOptions as any
) {
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
        type: (promptType as 'list') || 'list',
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
 * @param initialOptions 配置
 */
export function select<T extends keyof typeof SelectOptions>(type: T, initialOptions?: inquirer.ListQuestionOptions) {
  return gSel('list', initialOptions, SelectOptions)(type)
}

/**
 * 单选(带搜索)
 * @param name 选择器名称
 * @param initialOptions 配置
 */
export function selectWithSearch<T extends keyof typeof SelectOptions>(type: T, initialOptions?: inquirer.ListQuestionOptions) {
  return gSel('search-list', initialOptions, SelectOptions)(type)
}

/**
 * 多选
 * @param name 选择器名称
 * @param initialOptions 配置
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
export async function inputCommand(message: string = '>', autoCompletion?: string[]): Promise<string> {
  const promptOptions = {
    type: 'command',
    name: 'command',
    message: message,
    autoCompletion: [].concat(commonCommands, Array.isArray(autoCompletion) ? autoCompletion : []),
  }

  const { command } = await inquirer.prompt(promptOptions as any)
  return command
}

/**
 * 输入版本号
 * @param version 版本号
 * @param initialOptions 配置
 */
export async function inputVersion(message: string = i18n.UI__INPUT_VERSION__DEFAULT_MESSAGE``, initialOptions?: inquirer.InputQuestion): Promise<string> {
  const promptOptions: inquirer.InputQuestion = {
    ...initialOptions,
    type: 'input',
    name: 'version',
    message: message,
    validate: (version) => {
      if (semver.valid(version)) {
        return true
      }

      return i18n.UI__INPUT_VERSION__ERROR_INVALID_VERSION`${chalk.red(version)}`
    },
  }

  const { version } = await inquirer.prompt(promptOptions)
  return version
}

/**
 * 选择版本号
 * @param message 输出信息
 * @param curVer 当前版本号
 * @param identifier 预发布版本字段
 */
export async function selectVersion(message: string = i18n.UI__SELECT_VERSION__DEFAULT_MESSAGE``, curVer: string = '1.0.0', identifier?: string): Promise<string> {
  const { major, minor, patch, prerelease } = semver.parse(curVer)
  const isPrerelease = prerelease.length > 0

  let tarIdentifier: string
  if (!identifier) {
    const [curIdentifier = 'alpha'] = prerelease
    tarIdentifier = typeof curIdentifier === 'string' ? curIdentifier : 'alpha'
  }

  // 主版本
  const normalTypes: ReleaseType[] = ['patch', 'minor', 'major']
  const normalChoices = normalTypes.map((type) => {
    const version = `${major}.${minor}.${patch}`
    const value = semver.inc(version, type)
    const name = `${upperFirst(type)} (${value})`
    return { name, value }
  })

  // 预发布版本
  const preTypes: ReleaseType[] = ['prepatch', 'preminor', 'premajor']
  const preChoices = preTypes.map((type) => {
    const version = isPrerelease ? `${major}.${minor}.${patch}-${prerelease.join('.')}` : `${major}.${minor}.${patch}`
    const value = semver.inc(version, type, tarIdentifier)
    const name = `${upperFirst(type)} (${value})`
    return { name, value }
  })

  // 总选项
  const choices = (isPrerelease ? [...preChoices, ...normalChoices] : [...normalChoices, ...preChoices]).concat([
    { name: 'Custom Preprelease', value: 'cp' },
    { name: 'Custom Version', value: 'cv' },
  ])

  const promptOptions: inquirer.ListQuestion = {
    type: 'list',
    name: 'version',
    message: message,
    choices: choices,
    pageSize: 8,
  }

  const { version: result } = await inquirer.prompt(promptOptions)
  switch (result) {
    case 'cp': {
      const next = isPrerelease ? `${major}.${minor}.${patch}-${prerelease.join('.')}` : `${major}.${minor}.${patch}`
      const value = semver.inc(next, 'prerelease', tarIdentifier)
      const version = await inputVersion(i18n.UI__SELECT_VERSION__INPUT_CUSTOM_PRE_VERSION``, { default: value })
      return version
    }

    case 'cv': {
      const version = await inputVersion(i18n.UI__SELECT_VERSION__INPUT_CUSTOM_VERSION``)
      return version
    }
  }

  return result
}
