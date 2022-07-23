import { ipcMain, app, dialog } from 'electron'
import { resolve } from 'path'

import FSWorkspacesRepository from 'Repositories/implementations/FSWorkspacesRepository'
import FsItemsRepository from 'Repositories/implementations/FSItemsRepository'

import Application from 'src/app'
import FSDrive from 'Providers/implementations/FSDrive'
import FSDatabaseTableRepository from 'Repositories/implementations/FSDatabaseTableRepository'

const workspacesJSON = resolve(app.getPath('userData'), 'workspaces.json')
const tablesJSON = resolve(app.getPath('userData'), 'tables.json')

const drive = new FSDrive()

const workspacesRepository = new FSWorkspacesRepository(workspacesJSON)
const itemsRepository = new FsItemsRepository(drive)
const databaseTableRepository = new FSDatabaseTableRepository(tablesJSON)

const IndexSanApp = new Application(workspacesRepository, itemsRepository, databaseTableRepository)

ipcMain.removeHandler('use-case')

ipcMain.handle('use-case', (e, name, data) => IndexSanApp.useCase(name, data))

ipcMain.removeHandler('electron:show-dialog')

ipcMain.handle('electron:show-dialog', (_, data) => dialog.showOpenDialog(data))
