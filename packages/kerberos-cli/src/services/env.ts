import path from 'path'
import fs from 'fs-extra'
import dotenv from 'dotenv'
import { rootPath } from '../constants/conf'
import * as Types from '../types'

const dotenvFile = path.join(rootPath, '.env')
fs.ensureFileSync(dotenvFile)

export function getVariables(): Types.DotEnvVariables {
  const env = dotenv.config({ path: dotenvFile })
  return env.parsed || {}
}

export function updateVariables(variables: Types.DotEnvVariables) {
  const originVariables = getVariables()
  const mixed = Object.assign({}, originVariables, variables)
  const source = Object.keys(mixed).map((name) => {
    const value = mixed[name]
    return `${name}=${value}`
  })

  const content = source.join('\n')
  fs.writeFileSync(dotenvFile, content)
}
