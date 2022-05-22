import { ipcMain, app, dialog } from 'electron'
import { resolve } from 'path'

import FSWorkspacesRepository from 'Repositories/implementations/FSWorkspacesRepository'
import FsItemsRepository from 'Repositories/implementations/FSItemsRepository'
import FSConfigsRepository from 'Repositories/implementations/FSConfigsRepository'

import FSDrive from 'Providers/implementations/FSDrive'

import CreateWorkspace from 'UseCases/create-workspace'
import DeleteWorkspace from 'UseCases/delete-workspace'
import ListWorkspaces from 'UseCases/list-workspaces'

import CreateItem from 'UseCases/create-item'
import ListItems from 'UseCases/list-items'
import ShowItem from 'UseCases/show-item'
import ShowItemFile from 'UseCases/show-item-file'

const filename = resolve(app.getPath('userData'), 'workspaces.json')

const workspacesRepository = new FSWorkspacesRepository(filename)
const itemsRepository = new FsItemsRepository()
const configsRepository = new FSConfigsRepository()

const drive = new FSDrive()

const createWorkspace = new CreateWorkspace(workspacesRepository)
const deleteWorkspace = new DeleteWorkspace(workspacesRepository)
const listWorkspaces = new ListWorkspaces(workspacesRepository)

const listItems = new ListItems(workspacesRepository, itemsRepository, configsRepository)
const showItem = new ShowItem(workspacesRepository, itemsRepository, configsRepository)
const createItem = new CreateItem(workspacesRepository, itemsRepository)
const showItemFile = new ShowItemFile(workspacesRepository, itemsRepository, drive)

const useCases = [
  { name: 'create-workspace', useCase: createWorkspace },
  { name: 'list-workspaces', useCase: listWorkspaces },
  { name: 'delete-workspace', useCase: deleteWorkspace },
  { name: 'create-item', useCase: createItem },
  { name: 'list-items', useCase: listItems },
  { name: 'show-item', useCase: showItem },
  { name: 'show-item-file', useCase: showItemFile },
]

useCases.forEach(({ name, useCase }) => {
  ipcMain.removeHandler(`use-case:${name}`)
  ipcMain.handle(`use-case:${name}`, (_, data) => useCase.execute(data))
})

ipcMain.removeHandler('electron:show-dialog')

ipcMain.handle('electron:show-dialog', (_, data) => dialog.showOpenDialog(data))
