import fs from 'fs/promises'
import { resolve } from 'path'
import { BrowserWindow, app } from 'electron'

import { createBuilder } from 'Helpers/builder'

export default class ElectronApplication {
  constructor(
    protected builder = createBuilder(),
    protected publicDir = resolve(__dirname, 'public')
  ) {}

  protected async createWindow() {
    return new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: resolve(__dirname, 'preload.js'),
      },
    })
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
