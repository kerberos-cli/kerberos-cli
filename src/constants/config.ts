import path from 'path'

/** CLI根目录 */
export const rootPath = path.join(__dirname, '../../')

/** 临时目录 */
export const tmpPath = path.join(rootPath, '.temporary')

/** 配置文件名称 */
export const configFile = 'cerberus.json'

/** 配置项目名称 */
export const configProjectFolderName = 'doge'

/** 工作区模板 */
export const cerberusTemplate = path.join(rootPath, 'template/cerberus')

/** 配置区模板 */
export const configTemplate = path.join(rootPath, 'template/doge')
