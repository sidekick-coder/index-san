import { ipcMain, app, dialog } from 'electron'
import { resolve } from 'path'
import FileSystemWorkspaceRepository from 'Repositories/implementations/FilesystemWorkspaceRepository'
import CreateWorkspace from 'UseCases/create-workspace'
import DeleteWorkspace from 'UseCases/delete-workspace'
import ListWorkspaces from 'UseCases/list-workspaces'

const filename = resolve(app.getPath('userData'), 'workspaces.json')

const workspacesRepository = new FileSystemWorkspaceRepository(filename)
const createWorkspace = new CreateWorkspace(workspacesRepository)
const deleteWorkspace = new DeleteWorkspace(workspacesRepository)
const listWorkspaces = new ListWorkspaces(workspacesRepository)

const useCases = [
  { name: 'create-workspace', useCase: createWorkspace },
  { name: 'list-workspaces', useCase: listWorkspaces },
  { name: 'delete-workspace', useCase: deleteWorkspace },
]

useCases.forEach(({ name, useCase }) => {
  ipcMain.removeHandler(`use-case:${name}`)
  ipcMain.handle(`use-case:${name}`, (_, data) => useCase.execute(data))
})

ipcMain.handle('electron:show-dialog', (_, data) => dialog.showOpenDialog(data))
