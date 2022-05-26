import { debounce } from 'lodash'
import { watch as fsWatch, readdirSync } from 'fs'
import { resolve } from 'path'

interface Callback {
  (filename: string): void | Promise<void>
}

interface Options {
  ignore?: string[]
  throttleTime?: number
}

export function watch(source: string, callback: Callback, options?: Options) {
  const files = readdirSync(source).filter((filename) => {
    if (!options || !options.ignore) {
      return true
    }

    return !options.ignore.some((pattern) => new RegExp(pattern).test(filename))
  })

  const reload = debounce((filename: string | null) => {
    if (!filename) return

    callback(filename)
  }, options?.throttleTime || 1000)

  files.forEach((file) =>
    fsWatch(resolve(source, file), { recursive: true }, (_, filename) => {
      if (!filename) return

      reload(resolve(file, filename))
    })
  )
}
