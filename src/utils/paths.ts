import path from 'path'

export function pathToArray(...args: string[]) {
  return args
    .map((p) => p.split(/\/|\\/))
    .flat()
    .filter((p) => !!p)
}
