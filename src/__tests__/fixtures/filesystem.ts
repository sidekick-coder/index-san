import fs from 'fs/promises'
import { dirname, resolve } from 'path'
import { mkdirIfNotExist } from 'Utils/filesystem'
import { pathToArray } from 'Utils/paths'

const tmpDir = resolve(process.cwd(), 'tmp', '__tests__')

export async function createFolder(path: string) {
  const filepath = resolve(tmpDir, ...pathToArray(path))

  await mkdirIfNotExist(filepath)

  return filepath
}

export async function createFile(path: string, content = '') {
  const filepath = resolve(tmpDir, ...pathToArray(path))

  await mkdirIfNotExist(dirname(filepath))

  await fs.writeFile(filepath, content)

  return filepath
}

interface Options {
  content?: string
  pattern?: string
}

export async function createManyFiles(folderPath: string, length = 5, options?: Options) {
  const files = []

  await createFolder(folderPath)

  for (let i = 0; i < length; i++) {
    const pattern = options?.pattern || 'file-%1.txt'
    const filepath = await createFile(
      `/${folderPath}/${pattern.replace('%1', i.toString())}`,
      options?.content
    )

    files.push(filepath)
  }

  return files
}

export async function clean() {
  await fs.rm(tmpDir, { recursive: true })
}
