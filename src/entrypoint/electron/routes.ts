import { ipcMain } from 'electron'
import InMemoryWorkspaceRepository from 'src/tests/repositories/InMemoryWorkspaceRepository'
import CreateWorkspace from 'UseCases/create-workspace'
import ListWorkspaces from 'UseCases/list-workspaces'

const repository = new InMemoryWorkspaceRepository()
const createWorkspace = new CreateWorkspace(repository)
const listWorkspaces = new ListWorkspaces(repository)

ipcMain.handle('use-case:create-workspace', (_, data) => createWorkspace.execute(data))
ipcMain.handle('use-case:list-workspaces', () => listWorkspaces.execute())
