import App from '../../app'
import sinon from 'sinon'
import { container } from 'tsyringe'
import { resolve } from 'path'
import { mkdir, rm } from 'fs/promises'

export async function createTestApp() {
  const tmp = resolve(process.cwd(), 'tmp', 'user-data')

  const electron = {
    app: {
      getAppPath: sinon.stub().returns(process.cwd()),
      getPath: sinon.stub().returns(tmp),
    },
    ipcMain: {
      removeHandler: sinon.stub(),
      handle: sinon.stub(),
    },
    dialog: {
      showOpenDialog: sinon.stub(),
    },
  }

  const app = new App(electron as any)

  container.registerInstance(App, app)

  await mkdir(tmp, { recursive: true })

  await app.boot()

  async function cleanup() {
    await rm(tmp, { recursive: true })
  }

  return Object.assign(app, {
    cleanup,
    electronStub: electron,
  })
}
