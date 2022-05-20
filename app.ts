import Electron from 'electron'
import pino from 'pino'

import { resolve } from 'path'

import { container } from 'tsyringe'
import { debounce } from 'lodash'
import Option from 'App/models/Option'
export default class IndexSan {
  public _rootDir: string
  public _userDataDir: string
  public option: Option

  public logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
    },
  })

  constructor(public electron = Electron) {
    container.register(IndexSan, { useValue: this })

    this._rootDir = electron.app.getAppPath()
    this._userDataDir = electron.app.getPath('userData')

    this.option = new Option(this.userDataPath('options.json'))
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
    const bounds = await this.option.get('window:bounds', {})

    const window = new this.electron.BrowserWindow({
      ...bounds,
      webPreferences: {
        preload: this.distPath('config', 'preload.js'),
      },
    })

    window.on(
      'resize',
      debounce(() => this.option.set('window:bounds', window.getBounds()), 1000)
    )

    return window
  }
}
