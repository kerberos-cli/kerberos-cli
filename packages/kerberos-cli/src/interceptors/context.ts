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

async function lookupContext(context: string = process.cwd()): Promise<Context> {
  while (true) {
    const cfg = path.join(context, configFileName)
    const pkg = path.join(context, 'package.json')
    if ((await fs.pathExists(cfg)) && (await fs.lstat(cfg)).isSymbolicLink() && (await fs.pathExists(pkg))) {
      try {
        const cfgSource = await openJsonFile(cfg)
        const pkgSource = await openJsonFile(pkg)
        return { config: cfgSource, package: pkgSource, folder: context }
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

export default function context<T extends (...args: any[]) => Promise<any>, A extends Parameters<T>, R extends PromiseType<ReturnType<T>>>(
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
