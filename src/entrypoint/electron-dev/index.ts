import { BrowserWindow, app } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import { colorize } from 'Helpers/colorize'
import { watch } from 'Helpers/watch'
import { resolve } from 'path'

import ElectronApplication from '../electron'

const port = process.env.PORT || 3333
const host = process.env.HOST || 'localhost'

export default class ElectronDevApplication extends ElectronApplication {
  public window: BrowserWindow

  public async start() {
    await this.boot()

    this.startVite()

    this.window = await this.createWindow()

    await this.window.loadURL(`http://${host}:${port}`)

    await installExtension(VUEJS_DEVTOOLS)
      .then(() => console.log(colorize('Vue Devtools installed', 'blue')))
      .catch((err) => console.error(err))

    this.startWatch()
  }

  public startVite() {
    const { kill } = this.builder.vite('', '--port', String(port), '--host', host)

    app.on('window-all-closed', async () => {
      await kill()
      app.quit()
    })
  }

  public async tsc() {
    await this.builder
      .tsc()
      .then(() => console.log(colorize('tsc: build successfully!', 'blue')))
      .catch((err) => console.error(err))
  }

  public async reload(filename: string) {
    if (filename.includes('client')) return

    console.log(colorize(`reload: ${filename}`, 'blue'))

    this.builder.clearCache()

    await this.tsc()

    await this.boot()

    const devWindow = new BrowserWindow({
      show: false,
    })

    this.window.close()

    this.window = await this.createWindow()

    await this.window.loadURL(`http://${host}:${port}`)

    devWindow.close()
  }

  public startWatch() {
    const filepath = resolve(process.cwd(), 'src')

    watch(filepath, this.reload.bind(this), {
      ignore: ['client', 'entrypoint', 'tests'],
    })
  }
}
