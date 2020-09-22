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
  /** 工作区 */
  workspaces: string[]
  /** 项目信息 */
  projects?: CProject[]
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
  package: any
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
  /** 指定分支 */
  branch?: string
  /** 指定项目 */
  project?: string
}

/** clone 命令选项 */
export type CLICloneOptions = {
  /** 指定工作区 */
  workspace?: string
  /** 设置为可选项目 */
  optional?: boolean
}

/** Exec 命令选项 */
export type CLIExecOptions = {
  /** 指定项目 */
  project?: string
  /** 只执行一次 */
  excuteOnce?: boolean
}

/** Run 命令选项 */
export type CLIRunOptions = {
  /** 指定项目 */
  project?: string
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
