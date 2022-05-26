import fs from 'fs/promises'
import { resolve } from 'path'
import { BrowserWindow, app } from 'electron'

import { createBuilder } from 'Utils/builder'
import { Query } from '@code-pieces/db-json'
import { debounce } from 'lodash'

export default class ElectronApplication {
  constructor(
    protected builder = createBuilder(),
    protected publicDir = resolve(__dirname, 'public')
  ) {}

  public async getBounds() {
    const filename = resolve(app.getPath('userData'), 'options.json')

    const [option] = await Query.from(filename).where('name', 'window:bounds')

    return option?.value ?? {}
  }

  public async setBounds(data: any) {
    const filename = resolve(app.getPath('userData'), 'options.json')

    const [option] = await Query.from(filename).where('name', 'window:bounds')

    if (option) {
      return Query.from(filename).where('name', 'window:bounds').update({
        value: data,
      })
    }

    return Query.from(filename).insert({
      name: 'window:bounds',
      value: data,
    })
  }

  protected async createWindow() {
    const bounds = await this.getBounds()

    const window = new BrowserWindow({
      ...bounds,
      webPreferences: {
        preload: resolve(__dirname, 'preload.js'),
      },
    })

    window.on(
      'resize',
      debounce(async () => {
        await this.setBounds(window.getBounds())
      }, 1000)
    )

    return window
  }

  public async build() {
    await this.builder.vite('build', '--outDir', this.publicDir)
  }

  public async boot() {
    await app.whenReady()

    await import('./routes')
  }

  public async start() {
    const exists = await fs
      .stat(this.publicDir)
      .then(() => true)
      .catch(() => false)

    if (!exists) {
      await this.build()
    }

    await this.boot()

    const window = await this.createWindow()

    const filename = resolve(this.publicDir, 'index.html')

    await window.loadURL(filename)
  }
}
