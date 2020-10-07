/** bootstrap 命令选项 */
export type CLIBootstrapOptions = {
  /** 跳过提问 */
  yes?: boolean
  /** 只安装可选 */
  optional?: boolean
}

/** ls 命令选项 */
export type CLILsOptions = {
  /** 指定项目 */
  project?: string
  /** 显示依赖列表 */
  dependencies?: boolean
}

/** clone 命令选项 */
export type CLICloneOptions = {
  /** 指定工作区 */
  workspace?: string
  /** 设置为可选项目 */
  optional?: boolean
}

/** checkout 命令选项 */
export type CLICheckoutOptions = {
  /** 指定项目 */
  projects?: string[]
}

/** branch 命令选项 */
export type CLIBranchOptions = {
  /** 指定项目 */
  project?: string
}

/** version 命令选项 */
export type CLIVersionOptions = {
  /** 不推送 */
  noPush?: boolean
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

/** it 命令选项 */
export type CLIItOptions = {
  /** 显示全部 */
  all?: string
  /** 指定项目 */
  project?: string
}
