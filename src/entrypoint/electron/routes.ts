import { ipcMain, app, dialog } from 'electron'
import { resolve } from 'path'

import FSWorkspacesRepository from 'Repositories/implementations/FSWorkspacesRepository'
import FsItemsRepository from 'Repositories/implementations/FSItemsRepository'

import FSDrive from 'Providers/implementations/FSDrive'
import FSFolderDataView from 'Providers/implementations/FSFolderDataView'

import CreateWorkspace from 'UseCases/create-workspace'
import DeleteWorkspace from 'UseCases/delete-workspace'
import ListWorkspaces from 'UseCases/list-workspaces'

import CreateItem from 'UseCases/create-item'
import ListItems from 'UseCases/list-items'
import ShowItem from 'UseCases/show-item'
import ShowItemFile from 'UseCases/show-item-file'
import UpdateItemFile from 'UseCases/update-item-file'
import FSMetadataRepository from 'Repositories/implementations/FSMetasRepository'
import SaveItemMetadata from 'UseCases/save-item-metadata'

const filename = resolve(app.getPath('userData'), 'workspaces.json')

const workspacesRepository = new FSWorkspacesRepository(filename)
const itemsRepository = new FsItemsRepository()
const metadataRepository = new FSMetadataRepository()

const drive = new FSDrive()

const createWorkspace = new CreateWorkspace(workspacesRepository)
const deleteWorkspace = new DeleteWorkspace(workspacesRepository)
const listWorkspaces = new ListWorkspaces(workspacesRepository)

const listItems = new ListItems(workspacesRepository, itemsRepository, metadataRepository)
const showItem = new ShowItem(workspacesRepository, itemsRepository, metadataRepository)
const createItem = new CreateItem(workspacesRepository, itemsRepository)

const showItemFile = new ShowItemFile(workspacesRepository, itemsRepository, drive)
const updateItemFile = new UpdateItemFile(workspacesRepository, itemsRepository, drive)

const saveItemMetadata = new SaveItemMetadata(
  workspacesRepository,
  itemsRepository,
  metadataRepository
)

const useCases = [
  { name: 'create-workspace', useCase: createWorkspace },
  { name: 'list-workspaces', useCase: listWorkspaces },
  { name: 'delete-workspace', useCase: deleteWorkspace },
  { name: 'create-item', useCase: createItem },
  { name: 'list-items', useCase: listItems },
  { name: 'show-item', useCase: showItem },
  { name: 'show-item-file', useCase: showItemFile },
  { name: 'update-item-file', useCase: updateItemFile },
  { name: 'save-item-metadata', useCase: saveItemMetadata },
]

useCases.forEach(({ name, useCase }) => {
  ipcMain.removeHandler(`use-case:${name}`)
  ipcMain.handle(`use-case:${name}`, (_, data) => useCase.execute.bind(useCase)(data))
})

ipcMain.removeHandler('electron:show-dialog')

ipcMain.handle('electron:show-dialog', (_, data) => dialog.showOpenDialog(data))
