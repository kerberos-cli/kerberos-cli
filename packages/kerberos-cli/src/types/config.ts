/** 项目配置 */
export type CProject = {
  /** 项目名称 */
  name: string
  /** 项目地址 */
  repository: string
  /** 所在工作区 */
  workspace: string
  /** 选择性安装 */
  optional?: boolean
}

/** 全局配置 */
export type CConfig = {
  /** 版本号 */
  version: string
  /** 发布配置 */
  release?: {
    /** 发布类型 */
    type?: string
    /** 发布分支 */
    branch?: string
    /** 发布信息 */
    message?: string
  }
  /** 项目信息 */
  projects?: CProject[]
}

/** package json */
export type CPackage = {
  /** 名称 */
  name: string
  /** 版本 */
  version: string
  /** 是否为私有 */
  private?: boolean
  /** 工作区 */
  workspaces:
    | string[]
    | {
        packages?: string[]
        nohoist?: string[]
      }
  /** 脚本 */
  scripts?: {
    [name: string]: string
  }
  /** 依赖 */
  dependencies?: {
    [name: string]: string
  }
  /** 开发依赖 */
  devDependencies?: {
    [name: string]: string
  }
  /** 可选依赖 */
  optionalDependencies?: {
    [name: string]: string
  }
  /** 打包依赖 */
  bundleDependencies?: {
    [name: string]: string
  }
  /** 打包依赖 */
  bundledDependencies?: {
    [name: string]: string
  }
  /** 其他 */
  [name: string]: any
}
