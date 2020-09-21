/** 配置项的项目信息 */
export type CCSettingProject = {
  /** 项目名称 */
  name: string
  /** 项目地址 */
  repository: string
  /** 所在工作区 */
  workspace: string
  /** 选择性安装 */
  optional?: boolean
}

/** 配置信息 */
export type CCSettings = {
  /** 工作区 */
  workspaces: string[]
  /** 项目信息 */
  projects?: CCSettingProject[]
}

/** 工作区信息 */
export type CCWorkspace = {
  /** 工作区名称 */
  name: string
  /** 工作区文件夹 */
  folder: string
}

/** 项目信息 */
export type CCProject = {
  /** 项目名称 */
  name: string
  /** 项目文件夹 */
  folder: string
  /** 项目版本 */
  version: string
  /** 可执行脚本 */
  scripts: string[]
}
