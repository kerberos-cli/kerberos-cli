import fs from 'fs-extra'
import { cloneDeep } from 'lodash'

type FileMemory = Array<{
  file: string
  content: any
}>

const fileMemory: FileMemory = []

export async function openJsonFile(file: string) {
  const memory = fileMemory.find((item) => item.file === file)
  if (memory) {
    const { content } = memory
    return cloneDeep(content)
  }

  const content = (await fs.readJSON(file)) || {}
  fileMemory.push({ file, content })
  return content
}

export async function updateJsonFile(file: string, json: any) {
  const memory = fileMemory.find((item) => item.file === file)
  if (!memory) {
    return
  }

  if (!(await fs.pathExists(memory.file))) {
    return
  }

  memory.content = json
  await fs.writeFile(memory.file, JSON.stringify(json, null, 2))
}
