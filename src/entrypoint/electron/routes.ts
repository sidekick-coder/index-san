import { ipcMain, app, dialog } from 'electron'
import { resolve } from 'path'

import FSWorkspacesRepository from 'Repositories/implementations/FSWorkspacesRepository'
import FsItemsRepository from 'Repositories/implementations/FSItemsRepository'

import CreateItem from 'UseCases/create-item'
import CreateWorkspace from 'UseCases/create-workspace'
import DeleteWorkspace from 'UseCases/delete-workspace'
import ListWorkspaces from 'UseCases/list-workspaces'

const filename = resolve(app.getPath('userData'), 'workspaces.json')

const workspacesRepository = new FSWorkspacesRepository(filename)
const itemsRepository = new FsItemsRepository()

const createWorkspace = new CreateWorkspace(workspacesRepository)
const deleteWorkspace = new DeleteWorkspace(workspacesRepository)
const listWorkspaces = new ListWorkspaces(workspacesRepository)

const createItem = new CreateItem(workspacesRepository, itemsRepository)

const useCases = [
  { name: 'create-workspace', useCase: createWorkspace },
  { name: 'list-workspaces', useCase: listWorkspaces },
  { name: 'delete-workspace', useCase: deleteWorkspace },
  { name: 'create-item', useCase: createItem },
]

useCases.forEach(({ name, useCase }) => {
  ipcMain.removeHandler(`use-case:${name}`)
  ipcMain.handle(`use-case:${name}`, (_, data) => useCase.execute(data))
})

ipcMain.removeHandler('electron:show-dialog')

ipcMain.handle('electron:show-dialog', (_, data) => dialog.showOpenDialog(data))
