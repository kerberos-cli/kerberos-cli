import fs from 'fs-extra'
import path from 'path'
import commandExists, { sync as commandExistsSync } from 'command-exists'
import { ISpriteOptions } from './Sprite'
import Git from './Git'
import { spawn } from '../services/process'
import * as Types from '../types'

export type IPMInstallOptions = {
  peer?: boolean
  dev?: boolean
  optional?: boolean
  packageManager?: Types.PackageManager
}

export type PMOptions = ISpriteOptions & {
  packageManager?: Types.PackageManager
}

export default class PM extends Git {
  /** 是否支持Node的基础模块管理器NPM */
  static supported: boolean = commandExistsSync('npm') && Git.supported
  /** 模块管理工具 */
  protected $packageManager: 'yarn' | 'npm'
  /** 安装过的模块 */
  protected $installedModules: string[]

  constructor (options?: PMOptions) {
    super(options)
    this.$packageManager = options?.packageManager
    this.$installedModules = []
  }

  public async getPackageManager(): Promise<Types.PackageManager> {
    return this.$packageManager ? this.$packageManager : await this.determinePackageManager()
  }

  /**
   * 安装依赖
   * @param name 依赖名称
   * @param url 远程地址
   * @param options 配置
   */
  public async install(name: string, url: string, options?: IPMInstallOptions): Promise<void>
  /**
   * 安装依赖
   * @param dependences 依赖集合
   * @param options 配置
   */
  public async install(dependences: Array<{ name: string, url: string }>, options?: IPMInstallOptions): Promise<void>
  public async install(...args: any): Promise<void> {
    if (args.length === 3) {
      const [name, url, options] = args
      return this.install([{ name, url }], options)
    }

    const [dependences, options] = args
    const { peer = false, dev = false, optional = false } = options || {}
    const packageManager = options?.packageManager || await this.getPackageManager()
    const isYarn = packageManager === 'yarn'
    const installCommand = isYarn ? 'add' : 'install'

    const installArgs = [installCommand]
    dependences.forEach((dependency: { name: string, url: string }) => {
      if (typeof dependency === 'object' && dependency !== null) {
        const { name, url } = dependency
        installArgs.push(`${name}@${url}`)
      }
    })

    if (peer === true) {
      isYarn ? installArgs.push('--peer') : installArgs.push('--save-peer')
    }

    if (dev === true) {
      isYarn ? installArgs.push('--dev') : installArgs.push('--save-dev')
    }

    if (optional === true) {
      isYarn ? installArgs.push('--optional') : installArgs.push('--save-optional')
    }

    const packageFile = path.join(this.cwdPath, 'package.json')
    if (packageManager === 'npm' && !fs.existsSync(packageFile)) {
      await fs.writeFile(packageFile, '{}')
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const links = await this.fetchNpmLinks()

    try {
      await spawn(packageManager, installArgs, { stdio: 'inherit' })
      this.$installedModules.push(...dependences.map(item => item.name))

      const promises = links.map(({ file, real }) => async () => {
        if (await fs.pathExists(file)) {
          return Promise.resolve()
        }

        return fs.symlink(real, file)
      })

      await Promise.all(promises)

    } catch (error) {
      setTimeout(() => process.exit(0))
      throw error
    }
  }

  /** 获取所有NPM软链 */
  public async fetchNpmLinks(): Promise<Array<{ file: string, real: string }>> {
    const links = []
    const nodeModules = path.join(this.cwdPath, './node_modules')
    if (!fs.existsSync(nodeModules)) {
      return []
    }
  
    const files = await fs.readdir(nodeModules)
    files.forEach(filename => {
      const file = path.join(nodeModules, filename)
      const real = fs.realpathSync(file)
      real !== file && links.push({ file, real })
    })
  
    return links
  }

  /** 获取当前使用的包管理 */
  public async determinePackageManager(): Promise<'yarn' | 'npm'> {
    const lockFile = path.join(this.cwdPath, 'yarn.lock')
    if (fs.existsSync(lockFile)) {
      return 'yarn'
    }
  
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const hasYarn = await this.detectSupportYarn()
    return hasYarn ? 'yarn' : 'npm'
  }

  /** 判断是否支持Yarn */
  public async detectSupportYarn(): Promise<boolean> {
    const support = await commandExists('yarn')
    return support ? true : false
  }
}
