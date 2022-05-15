import App from '../../app'
import sinon from 'sinon'
import { container } from 'tsyringe'
import { resolve } from 'path'
import { mkdir, rm } from 'fs/promises'

export async function createTestApp() {
  const tmp = resolve(process.cwd(), 'tmp', 'user-data')

  const electron = {
    ipcMain: {
      removeHandler: sinon.stub(),
      handle: sinon.stub(),
    },
  }

  const app = new App(electron as any, process.cwd(), tmp)

  container.registerInstance(App, app)

  await mkdir(tmp, { recursive: true })

  await app.boot()

  async function cleanup() {
    await rm(tmp, { recursive: true })
  }

  return Object.assign(app, {
    cleanup,
  })
}
