import { ipcMain, app, dialog } from 'electron'
import { resolve } from 'path'

import FSWorkspacesRepository from 'Repositories/implementations/FSWorkspacesRepository'
import FsItemsRepository from 'Repositories/implementations/FSItemsRepository'

import FSMetadataRepository from 'Repositories/implementations/FSMetasRepository'
import Application from 'src/app'

const filename = resolve(app.getPath('userData'), 'workspaces.json')

const workspacesRepository = new FSWorkspacesRepository(filename)
const metadataRepository = new FSMetadataRepository(workspacesRepository)
const itemsRepository = new FsItemsRepository(workspacesRepository, metadataRepository)

const IndexSanApp = new Application(workspacesRepository, itemsRepository, metadataRepository)

ipcMain.removeHandler('use-case')

ipcMain.handle('use-case', (e, name, data) => IndexSanApp.useCase(name, data))

ipcMain.removeHandler('electron:show-dialog')

ipcMain.handle('electron:show-dialog', (_, data) => dialog.showOpenDialog(data))
