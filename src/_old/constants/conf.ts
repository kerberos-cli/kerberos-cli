import fs from 'fs-extra'
import path from 'path'

interface PackageJson {
  name: string
  version: string
}

const packageJson: PackageJson = fs.readJSONSync(path.join(__dirname, '../../package.json'))

/** 项目名称 */
export const name = packageJson.name
/** 版本号 */
export const version = packageJson.version
/** 运行目录 */
export const cwdPath = process.cwd()
/** 配置文件 */
export const cfgFile = 'cerberus.json'
/** package.json 文件 */
export const pkgFile = 'package.json'
