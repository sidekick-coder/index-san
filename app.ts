import Electron from 'electron'
import { resolve } from 'path'

import Router from './lib/Router'
import { container, injectable } from 'tsyringe'
import { debounce } from 'lodash'
import Option from 'App/models/Option'
export default class IndexSan {
  public router = new Router()
  public _rootDir: string
  public _userDataDir: string

  constructor(public electron = Electron) {
    container.register(IndexSan, { useValue: this })

    this._rootDir = electron.app.getAppPath()
    this._userDataDir = electron.app.getPath('userData')
  }

  public appPath(...args: string[]) {
    return resolve(this._rootDir, ...args)
  }

  public distPath(...args: string[]) {
    return this.appPath('dist', ...args)
  }

  public publicPath(...args: string[]) {
    return this.distPath('public', ...args)
  }

  public userDataPath(...args: string[]) {
    return resolve(this.electron.app.getPath('userData'), ...args)
  }

  public async boot() {
    const files = [
      () => import('./start/routes'),
      () => import('./start/data'),
      () => import('./start/protocols'),
    ]

    const modules = await Promise.all(files.map((f) => f()))

    await Promise.all(modules.map((m) => m.default(this)))
  }

  public async start() {
    return this.electron.app.whenReady()
  }

  public async createWindow() {
    const bounds = await Option.get('window:bounds', {})

    const window = new this.electron.BrowserWindow({
      ...bounds,
      webPreferences: {
        preload: this.distPath('config', 'preload.js'),
      },
    })

    window.on(
      'resize',
      debounce(async () => {
        await Option.set('window:bounds', window.getBounds())
      }, 1000)
    )

    return window
  }
}
