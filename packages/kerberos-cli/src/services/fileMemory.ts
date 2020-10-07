import fs from 'fs-extra'
import { cloneDeep } from 'lodash'
import JSON from 'comment-json'

type FileMemory = Array<{
  file: string
  content: any
}>

const fileMemory: FileMemory = []

/**
 * 读取JSON文件
 * @param file 文件路径
 */
export async function openJsonFile(file: string) {
  const memory = fileMemory.find((item) => item.file === file)
  if (memory) {
    const { content } = memory
    return cloneDeep(content)
  }

  const json = await fs.readFile(file, 'utf-8')
  const content = JSON.parse(json)
  fileMemory.push({ file, content })
  return content
}

/**
 * 同步文件内容
 * @param file 文件路径
 * @param data 文件内容
 */
export async function updateJsonFile(file: string, data: any) {
  const memory = fileMemory.find((item) => item.file === file)
  if (!memory) {
    return
  }

  if (!(await fs.pathExists(memory.file))) {
    return
  }

  memory.content = data
  await fs.writeFile(memory.file, JSON.stringify(data, null, 2))
}

/**
 * 同步文件内容
 * @param file 文件路径
 */
export async function syncJsonFile(file: string) {
  const json = await fs.readFile(file, 'utf-8')
  const content = JSON.parse(json)
  await updateJsonFile(file, content)
}
