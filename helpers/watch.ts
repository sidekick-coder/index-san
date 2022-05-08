import { debounce } from 'lodash'
import { watch as fsWatch, readdirSync } from 'fs'
import { resolve } from 'path'

interface Callback {
  (filename: string): void | Promise<void>
}

interface Options {
  ignore?: string[]
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
  }, 500)

  files.forEach((file) =>
    fsWatch(file, { recursive: true }, (_, filename) => {
      if (!filename) return

      reload(resolve(file, filename))
    })
  )
}
