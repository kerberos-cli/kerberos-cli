import fs from 'fs-extra'
import path from 'path'
import Sprite, { ISpriteOptions } from './Sprite'
import PM from './PM'
import pick from '../share/pick'
import convertGitRepoToDependency from '../share/convertGitRepoToDependency'
import { spawn } from '../services/process'
import * as Types from '../types'

export type CerberusHost = {
  [K: string]: Exclude<Types.Repository, string>
}

export default class Cerberus extends Sprite {
  protected $hosts: CerberusHost
  protected $pm: PM
  protected $name: string

  constructor (options?: ISpriteOptions) {
    super(options)

    this.$hosts = {}
    this.$pm = new PM(options)
  }

  public async exec(command: string, params?: string[]): Promise<void> {
    if (!(typeof command === 'string' && command.length > 0)) {
      return
    }

    const pm = await this.$pm.getPackageManager()
    const promises = Object.keys(this.$hosts).map(async name => {
      const cwd = path.resolve(`node_modules/${name}`)
      // npm explore shopline-app-editor -- yarn start
      await spawn('npm', [command, ...params, '--modules-folder', path.join(process.cwd(), 'node_modules')], { cwd, stdio: 'inherit' })
    })

    await Promise.all(promises)
  }

  public async digestProject (): Promise<void> {
    const pkgFile = path.join(this.cwdPath, 'package.json')
    if (!await fs.pathExists(pkgFile)) {
      throw new Error(`Cwd is an invalid npm project, please npm init first in ${this.cwdPath}`)
    }

    const source = await fs.readJSON(pkgFile)
    this.$name = source.name
  }

  public async digestConfigFile (file: string = this.configFile): Promise<void> {
    if (!await fs.pathExists(file)) {
      throw new Error(`Config file ${file} is not found.`)
    }

    const conf = await fs.readJSON(file) as Types.CerberusConfig
    if (typeof conf.hosts === 'object' && conf.hosts !== null) {
      Object.keys(conf.hosts).forEach(name => {
        const repository = conf.hosts[name]
        if (typeof repository === 'string') {
          this.$hosts[name] = { repository }

        } else if (typeof repository === 'object') {
          const repo = pick(repository, ['alias', 'repository'])
          if (Object.keys(repo).length > 0) {
            this.$hosts[name] = repo
          }
        }
      })
    }
  }

  public async digestHosts (hosts: CerberusHost = this.$hosts): Promise<void> {
    if (!(typeof hosts === 'object' && hosts !== null && Object.keys(hosts).length > 0)) {
      return
    }

    const names = Object.keys(hosts)
    const promises = names.map(async name => {
      const folder = path.resolve(`node_modules/${name}`)
      if (!fs.pathExistsSync(folder)) {
        return null
      }

      const repo = hosts[name]
      if (typeof repo === 'object' && repo !== null) {
        const { repository } = repo
        const url = convertGitRepoToDependency(repository)
        return { name, url }
      }
    })

    const dependencies = await Promise.all(promises)
    await this.$pm.install(dependencies.filter(Boolean), { dev: true })
  }

  public async digest (): Promise<void> {
    const names = Object.keys(this.$hosts)
      const promises = names.map(async name => {
        const folder = path.resolve(`node_modules/${name}`)
        const spy = path.join(folder, 'node_modules', this.$name)
        await fs.ensureDir(path.dirname(spy))
        if (!await fs.pathExists(spy)) {
          await fs.symlink(this.cwdPath, spy)
        }
      })

    await Promise.all(promises)
  }
}
