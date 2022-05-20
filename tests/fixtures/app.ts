import App from '../../app'
import sinon from 'sinon'
import { container } from 'tsyringe'
import { resolve } from 'path'
import { mkdirIfNotExist, removeIfExist } from 'Helpers/filesystem'

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
      emit: sinon.stub(),
    },
    dialog: {
      showOpenDialog: sinon.stub(),
    },
    protocol: {
      registerFileProtocol: sinon.stub(),
    },
    webContents: {
      getAllWebContents: sinon.stub().returns([]),
    },
  }

  const app = new App(electron as any)

  container.registerInstance(App, app)

  await mkdirIfNotExist(tmp)

  await app.boot()

  return Object.assign(app, {
    electronStub: electron,
  })
}
