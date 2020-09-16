import path from 'path'
import fs from 'fs-extra'
import { cwdPath, cfgFile } from '../constants/conf'

export type ISpriteOptions = {
  cwd?: string
  configFileName?: string
}

export default class Sprite {
  /** 运行目录 */
  protected $cwdPath: string
  /** 配置文件名 */
  protected $configFileName: string
  /** 运行目录 */
  public get cwdPath (): string {
    return this.$cwdPath
  }
  /** 配置文件路径 */
  public get configFile (): string {
    return path.join(this.$cwdPath, this.$configFileName)
  }

  constructor (options?: ISpriteOptions) {
    this.$cwdPath = options?.cwd || cwdPath
    this.$configFileName = options?.configFileName || cfgFile
  }
}
