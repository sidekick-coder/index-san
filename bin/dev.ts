import 'reflect-metadata'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import IndexSan from '../app'
import { resolve } from 'path'
import { createBuilder } from 'Helpers/builder'
import { createTimer } from 'Helpers/timer'
import { colorize } from 'Helpers/colorize'
import { watch } from 'Helpers/watch'

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

const { clearCache, tsc, vite } = createBuilder()

let app = new IndexSan()
let window: Electron.BrowserWindow

app._rootDir = resolve(__dirname, '..')

async function reopenApp() {
  clearCache()

  const IndexSan = (await import('../app')).default

  app = new IndexSan()

  app._rootDir = resolve(__dirname, '..')

  await app.boot()

  window = await app.createWindow()

  await window.loadURL(`http://${host}:${port}`)

  await installExtension(VUEJS_DEVTOOLS)
    .then((name) => app.logger.info(`Added Extension:  ${name}`))
    .catch((err) => app.logger.child({ err }).error('An error occurred: %s', err.message))

  return app
}

async function reload(filename: string) {
  if (filename.includes('resources')) {
    return
  }

  console.log(colorize(`watcher: file changed: ${filename} `, 'gray'))
  console.log(colorize('watcher: rebuilding...', 'gray'))

  const timer = createTimer()

  await tsc()
    .then(() => console.log(colorize('tsc: build successfully!', 'blue')))
    .catch((err) => console.error(err))

  const devWindow = new app.electron.BrowserWindow({
    show: false,
  })

  window.close()

  await reopenApp()

  devWindow.close()

  console.log(colorize(`watcher: reload time ${timer.get()}ms `, 'gray'))
}

async function main() {
  const { kill } = vite('', '--port', String(port), '--host', host)

  app.electron.app.on('window-all-closed', async () => {
    await kill()
    app.electron.app.quit()
  })

  await reopenApp()

  watch(app.appPath(), reload, {
    ignore: ['dist', 'main.ts', 'node_modules', 'public', '.git'],
  })
}

app
  .start()
  .then(main)
  .then(() => console.log(colorize('watcher: running in development watching files...', 'gray')))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
