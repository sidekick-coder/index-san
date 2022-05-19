import { RmOptions } from 'fs'
import path from 'path'
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

export function normalizePath(...args: string[]) {
  return args
    .map((p) => p.split('/'))
    .flat()
    .filter((p) => !!p)
    .filter((p) => !p.includes(path.sep))
}

export function resolve(...args: string[]) {
  return normalizePath(...args).join('/')
}

export function systemResolve(...args: string[]) {
  return path.resolve(...args)
}

export function basename(args: string) {
  return path.basename(args)
}

export function extname(args: string) {
  return path.extname(args)
}
