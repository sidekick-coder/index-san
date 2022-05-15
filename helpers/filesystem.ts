import { RmOptions } from 'fs'
import fs from 'fs/promises'

export async function exists(path: string) {
  return fs
    .stat(path)
    .then(() => true)
    .catch(() => false)
}

export async function removeIfExist(path: string, options: RmOptions = { recursive: true }) {
  const isValid = await exists(path)

  if (!isValid) return

  await fs.rm(path, options)
}
