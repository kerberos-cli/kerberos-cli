import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'
import inquirer from 'inquirer'
import flattenDeep from 'lodash/flattenDeep'
import { execPath } from '../constants/config'
import * as Types from '../types'
import { glob } from 'glob'

export async function selectPackage(config: Types.CerberusSettings, options?: { cwd?: string }) {
  const { packages } = config || {}
  if (!Array.isArray(packages)) {
    return []
  }

  const selectOptions = packages.map(item => {
    const name = path.dirname(item)
    const value = path.join(options?.cwd || execPath, name)
    return { name, value }
  })

  const { value: selected } = await inquirer.prompt({
    type: 'list',
    name: 'value',
    message: 'Please select clone folder',
    choices: selectOptions,
  })

  return selected
}

export async function openConfigFile(file?: string, options?: { cwd?: string }): Promise<Types.CerberusSettings> {
  const configFile = path.isAbsolute(file) ? file : path.join(options?.cwd || execPath, file)
  const source = await fs.readJSON(configFile)
  return source
}

export async function getPackages(config: Types.CerberusSettings, options?: { cwd?: string }): Promise<Array<{ name: string, version: string }>> {
  const { packages } = config || {}
  if (!Array.isArray(packages)) {
    return []
  }

  const globPromises = packages.map(async item => {
    const pattern = path.join(options?.cwd || execPath, item)
    return await promisify(glob)(pattern)
  })

  const folders = await Promise.all(globPromises)
  const pkgPromises = flattenDeep(folders).map(async folder => {
    const file = path.join(folder, 'package.json')
    if (await fs.pathExists(file)) {
      const { name, version } = await fs.readJSON(file)
      return { name, version }
    }
  })

  return await Promise.all(pkgPromises)
}
