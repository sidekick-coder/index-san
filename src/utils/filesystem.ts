import fs from 'fs/promises'
import path from 'path'

export async function mkdirIfNotExist(arg: string) {
  const folderExist = await exists(arg)

  if (folderExist) return

  await fs.mkdir(arg, { recursive: true })
}

export async function writeFileIfNotExist(arg: string, defaultData = '') {
  const fileExist = await exists(arg)

  if (fileExist) return

  await mkdirIfNotExist(path.dirname(arg))

  await fs.writeFile(arg, defaultData)
}

export async function exists(path: string) {
  return fs
    .stat(path)
    .then(() => true)
    .catch(() => false)
}

export async function readdirIfExist(arg: string) {
  const folderExist = await exists(arg)

  if (!folderExist) return []

  return fs.readdir(arg, { withFileTypes: true })
}

export async function readFileIfExist(arg: string) {
  const fileExist = await exists(arg)

  if (!fileExist) return ''

  return fs.readFile(arg, 'utf8')
}
