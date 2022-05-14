import App from '../../app'
import sinon from 'sinon'
import { container } from 'tsyringe'
import { resolve } from 'path'
import { mkdir, rm } from 'fs/promises'

const tmp = resolve(process.cwd(), 'tmp')

export async function createTestApp() {
  const electron = {
    ipcMain: {
      removeHandler: sinon.stub(),
      handle: sinon.stub(),
    },
  }

  const app = new App(electron as any, process.cwd(), resolve(tmp, 'user-data'))

  container.registerInstance(App, app)

  await mkdir(tmp, { recursive: true })
  await mkdir(resolve(tmp, 'user-data'), { recursive: true })

  await app.boot()

  async function cleanup() {
    await rm(tmp, { recursive: true })
  }

  return Object.assign(app, {
    cleanup,
  })
}
