import { BrowserWindow, app } from 'electron'
import { resolve } from 'path'
import { debounce } from 'lodash'

import Router from './lib/Router'
import Option from './app/models/Option'

export default class App {
  public router: Router
  public window: BrowserWindow

  public appPath(...args: string[]) {
    return resolve(app.getAppPath(), ...args)
  }

  public distPath(...args: string[]) {
    return this.appPath('dist', ...args)
  }

  public publicPath(...args: string[]) {
    return this.distPath('public', ...args)
  }

  public async boot() {
    const register = (await import('./start/routes')).default
    const userData = (await import('./start/user-data')).default

    await register(this.router)

    await userData()
  }

  public async startWindow() {
    const bounds = await Option.get('window:bounds', {
      width: 800,
      height: 600,
      x: 0,
      y: 0,
    })

    this.window = new BrowserWindow({
      ...bounds,
      webPreferences: {
        preload: this.distPath('config', 'preload.js'),
      },
    })

    await this.window.loadFile(this.publicPath('index.html')).catch(console.error)

    this.window.on(
      'resize',
      debounce(
        () => Option.updateOrCreate('window:bounds', JSON.stringify(this.window.getBounds())),
        500
      )
    )
  }

  public async start() {
    this.router = new Router()

    await this.boot()

    await this.startWindow()
  }

  public stop() {
    this.window.close()
  }
}
