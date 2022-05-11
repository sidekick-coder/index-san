import { app as ElectronApp, BrowserWindow } from 'electron'

import { Builder } from './bin/app-build'
import { watch, colorize, createTimer } from './helpers'

const isDev = process.env.NODE_ENV === 'development'

function clearCache() {
  Object.keys(require.cache)
    .filter((key) => key.includes(ElectronApp.getAppPath()))
    .filter((key) => !key.includes('node_modules'))
    .forEach((key) => delete require.cache[key])
}

async function getApp() {
  const App = (await import('./app')).default

  return new App()
}

export async function main() {
  if (!isDev) {
    return getApp().then((app) => app.start())
  }

  const builder = new Builder(ElectronApp.getAppPath())

  await builder.build()

  let app = await getApp()

  await app.start()

  async function reload(filename: string) {
    console.log(colorize(`watcher: file changed: ${filename} `, 'gray'))
    console.log(colorize('watcher: rebuilding...', 'gray'))

    const timer = createTimer()
    const isResource = filename.includes('resources')

    if (isResource) {
      await builder.vue()
    }

    if (!isResource) {
      await builder.tsc()
    }

    await builder.postBuild()

    app.window.webContents.reload()

    if (!isResource) {
      // this makes the process not be killed when reloading
      const devWindow = new BrowserWindow({
        show: false,
      })

      clearCache()

      app.stop()

      app = await getApp()

      await app.start()

      devWindow.close()
    }

    console.log(colorize(`watcher: reload time ${timer.get()}ms `, 'gray'))
  }

  watch(app.appPath(), reload, { ignore: ['dist', 'main.ts', 'node_modules', 'public', '.git'] })

  console.log(colorize('watcher: watching for changes...', 'gray'))
}

ElectronApp.whenReady().then(main).catch(console.error)
