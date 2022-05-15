import execa from 'execa'
import { resolve } from 'path'

export function createBuilder(root = process.cwd()) {
  function tsc(...args: string[]) {
    const config = resolve(root, 'tsconfig.json')

    const bin = resolve(root, 'node_modules', '.bin', 'tsc')

    return execa(bin, ['-p', config, ...args])
  }

  function vite(command = '', ...args: string[]) {
    const bin = resolve(root, 'node_modules', '.bin', 'vite')

    const folder = resolve(root, 'resources')

    const child = execa(bin, [command, folder, ...args], {
      stderr: 'inherit',
      cleanup: true,
    })

    const kill = async () => {
      await execa('taskkill', ['/pid', (child.pid as number).toString(), '/f', '/t'])
        .then(() => console.log('vite: process killed'))
        .catch((err) => console.error('vite: process kill error\n\n', err))
    }

    return {
      ...child,
      kill,
    }
  }

  function clearCache() {
    Object.keys(require.cache)
      .filter((key) => key.includes(root))
      .filter((key) => !key.includes('node_modules'))
      .forEach((key) => delete require.cache[key])
  }

  return {
    tsc,
    vite,
    clearCache,
  }
}
