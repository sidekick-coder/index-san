import fs from 'fs'
import path from 'path'

const tmpPath = path.resolve(__dirname, '..', 'tmp')

if (!fs.existsSync(tmpPath)) {
  fs.mkdirSync(tmpPath)
}

export function createFakePath(...args: string[]) {
  return path.resolve(tmpPath, ...args)
}

export async function cleanup() {
  const exists = await fs.promises
    .stat(tmpPath)
    .then(() => true)
    .catch(() => false)

  if (exists) {
    await fs.promises.rm(tmpPath, { recursive: true })
  }
}
