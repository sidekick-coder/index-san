import { app, BrowserWindow } from 'electron'
import { debounce } from 'lodash'
import { resolve } from 'path'

import Option from './app/models/Option'
import { Builder } from './bin/app-build'
import { watch, colorize, createTimer } from './helpers'

const isDev = process.env.NODE_ENV === 'development'
const distFile = resolve(__dirname, 'public', 'index.html')

export async function createWindow() {
  const option = await Option.find<Record<string, number>>('window:bounds')

  const bounds = {
    width: 800,
    height: 600,
    x: 0,
    y: 0,
  }

  if (option) {
    bounds.width = option.value.width
    bounds.height = option.value.height
    bounds.x = option.value.x
    bounds.y = option.value.y
  }

  const window = new BrowserWindow({
    ...bounds,
    webPreferences: {
      preload: resolve(__dirname, 'config', 'preload.js'),
    },
  })

  await window.loadFile(distFile)

  window.on(
    'resize',
    debounce(() => Option.updateOrCreate('window:bounds', JSON.stringify(window.getBounds())), 500)
  )

  return window
}

async function boot() {
  const files = [
    (await import('./start/routes')).default,
    (await import('./start/user-data')).default,
  ]

  await Promise.all(
    files.map(async (file) => {
      await file()
    })
  )
}

export async function main() {
  await boot()

  if (!isDev) {
    return await createWindow()
  }

  const builder = new Builder(app.getAppPath())

  let window = await createWindow()

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
      Object.keys(require.cache)
        .filter((key) => /app|config/.test(key))
        .forEach((key) => {
          delete require.cache[key]
        })
    }

    builder.postBuild()

    if (isResource) {
      window.webContents.reload()
    }

    if (!isResource) {
      await boot()

      window.close()
      window = await createWindow()
    }

    console.log(colorize(`watcher: reload time ${timer.get()}ms `, 'gray'))
  }

  watch(app.getAppPath(), reload, { ignore: ['dist', 'node_modules', 'public', '.git'] })

  console.log(colorize('watcher: watching for changes...', 'gray'))
}

app.whenReady().then(main).catch(console.error)
