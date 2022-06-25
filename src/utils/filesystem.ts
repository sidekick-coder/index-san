import fs from 'fs/promises'
import path from 'path'

export async function exists(path: string) {
  return fs
    .stat(path)
    .then(() => true)
    .catch(() => false)
}

export async function mkdirIfNotExist(arg: string) {
  const folderExist = await exists(arg)

  if (folderExist) return

  await fs.mkdir(arg, { recursive: true })
}

export async function writeFileIfNotExist(arg: string, content = '') {
  await mkdirIfNotExist(path.dirname(arg))

  await fs.writeFile(arg, content)
}

export async function readdirIfExist(arg: string) {
  return fs
    .readdir(arg, { withFileTypes: true })
    .then((data) => data)
    .catch(() => [])
}

export async function readFileIfExist(arg: string, encoding?: BufferEncoding) {
  return fs
    .readFile(arg, encoding)
    .then((data) => data)
    .catch(() => null)
}

export async function deleteIfExist(arg: string) {
  return fs
    .rm(arg, { recursive: true })
    .then((data) => data)
    .catch(() => null)
}
