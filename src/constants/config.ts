import path from 'path'

/** 初始执行目录 */
export const execPath = process.cwd()

/** CLI根目录 */
export const rootPath = path.join(__dirname, '../../')

/** 临时目录 */
export const tmpPath = path.join(rootPath, '.temporary')

/** 配置区模板 */
export const configTemplate = path.join(rootPath, 'template/doge')

/** 配置文件名称 */
export const configFileName = 'kerberos.json'

/** 工作区 package.json 名称 */
export const packageFileName = 'package.workspace.json'

/** 配置项目名称 */
export const configProjectFolderName = 'doge'

/** 默认工作区名称 */
export const defaultWorkspaceName = '@kerberos'
