import fs from 'fs-extra'
import path from 'path'
import { PromiseType } from 'utility-types'
import { warn, fail } from '../services/logger'
import { openJsonFile } from '../services/fileMemory'
import { configFileName } from '../constants/conf'
import i18n from '../i18n'
import * as Types from '../types'

type Context = {
  config: Types.CConfig
  package: object
  folder: string
}

/** 状态机 */
const state: { context?: Context } = {}

/**
 * 查找上下文
 * @param context 所在目录
 */
export async function lookupContext(context: string = process.cwd()): Promise<Context> {
  if (state.context) {
    return state.context
  }

  while (true) {
    const cfg = path.join(context, configFileName)
    const pkg = path.join(context, 'package.json')
    if ((await fs.pathExists(cfg)) && (await fs.pathExists(pkg))) {
      try {
        const cfgSource = await openJsonFile(cfg)
        const pkgSource = await openJsonFile(pkg)
        state.context = { config: cfgSource, package: pkgSource, folder: context }
        return state.context
      } catch (error) {
        warn(error.message)
        // nothing todo...
      }
    }

    const next = path.dirname(context)
    if (context === next) {
      return null
    }

    context = next
  }
}

/**
 * 将执行环境切换成工作区根目录
 * @description
 * 主要为了在工作区中所有项目都可以
 * 直接调用工作区的配置, 类似 Git 命令
 */
export default function contextInterceptor<T extends (...args: any[]) => Promise<any>, A extends Parameters<T>, R extends PromiseType<ReturnType<T>>>(
  callback: T
): (...args: A) => Promise<R> {
  return async function (...args: A): Promise<R> {
    const context = await lookupContext()
    if (!context) {
      fail(i18n.INTERCEPTORS__CONTEXT__ERROR_INVALID_PROJECT``)
      process.exit(0)
    }

    const { folder } = context
    process.chdir(folder)

    return callback(...args)
  }
}
