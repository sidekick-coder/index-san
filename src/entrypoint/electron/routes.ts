import { ipcMain, app, dialog } from 'electron'
import { resolve } from 'path'

import FSWorkspacesRepository from 'Repositories/implementations/FSWorkspacesRepository'
import FsItemsRepository from 'Repositories/implementations/FSItemsRepository'

import Application from 'src/app'

const filename = resolve(app.getPath('userData'), 'workspaces.json')

const workspacesRepository = new FSWorkspacesRepository(filename)
const itemsRepository = new FsItemsRepository(workspacesRepository)

const IndexSanApp = new Application(workspacesRepository, itemsRepository)

ipcMain.removeHandler('use-case')

ipcMain.handle('use-case', (e, name, data) => IndexSanApp.useCase(name, data))

ipcMain.removeHandler('electron:show-dialog')

ipcMain.handle('electron:show-dialog', (_, data) => dialog.showOpenDialog(data))
