// 工具
// ----------

/** 获取集合中所有键值 */
export type KeyOfUnion<U> = U extends object ? keyof U : never

// 配置
// ----------

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

// 信息
// ----------

/** 项目信息 */
export type DProject = {
  /** 项目名称 */
  name: string
  /** 工作区路径 */
  folder: string
  /** 项目版本 */
  version: string
  /** package json */
  package: CPackage
}

/** 工作区信息 */
export type DWorkspace = {
  /** 工作区名称 */
  name: string
  /** 工作区路径 */
  folder: string
}

/** 工作区选项 */
export type DWorkspaceChoice = DWorkspace

/** 项目距选项 */
export type DProjectChoice = DProject

/** 分支选项 */
export type DBranchChoice = {
  name: string
  value: string
}

/** 脚本选项 */
export type DScriptChoice = {
  name: string
  command: string
}

/** 在配置中的项目选项 */
export type DProjectInConfChoice = CProject

// 命令
// ----------

/** bootstrap 命令选项 */
export type CLIBootstrapOptions = {
  /** 跳过提问 */
  yes?: boolean
  /** 只安装可选 */
  optional?: boolean
}

/** branch 命令选项 */
export type CLIBranchOptions = {
  /** 指定项目 */
  project?: string
}

/** checkout 命令选项 */
export type CLICheckoutOptions = {
  /** 指定项目 */
  projects?: string[]
}

/** clone 命令选项 */
export type CLICloneOptions = {
  /** 指定工作区 */
  workspace?: string
  /** 设置为可选项目 */
  optional?: boolean
}

/** exec 命令选项 */
export type CLIExecOptions = {
  /** 指定项目 */
  project?: string
}

/** exec-multi 命令选项 */
export type CLIExecMultiOptions = {
  /** 指定项目 */
  projects?: string[]
}

/** run 命令选项 */
export type CLIRunOptions = {
  /** 指定项目 */
  project?: string
}

/** run-multi 命令选项 */
export type CLIRunMultiOptions = {
  /** 指定项目 */
  projects?: string[]
}

/** it 命令选项 */
export type CLIItOptions = {
  /** 显示全部 */
  all?: string
  /** 指定项目 */
  project?: string
}

/** ls 命令选项 */
export type CLILsOptions = {
  /** 指定项目 */
  project?: string
  /** 显示依赖列表 */
  dependencies?: boolean
}

// 其他
// ----------

/** 一维依赖列表 */
export type FlattenDependencyList = {
  name: string
  dependencies?: string[]
}[]

/** 选项生成器 */
export type ChoicesGenerator = (...args: any[]) => any

/** 选项生成器集合 */
export type ChoicesGenerators<C> = {
  [N in keyof C]: C[N] extends ChoicesGenerator ? C[N] : never
}
