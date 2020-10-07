import { CPackage, CProject } from './config'

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
