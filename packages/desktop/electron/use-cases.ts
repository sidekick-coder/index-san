import { app } from 'electron'
import path from 'path'

import DriveManager from '@core/gateways/drive-manager'

import ListWorkspaces from '@core/use-cases/list-workspaces/list-workspaces'
import CreateWorkspace from '@core/use-cases/create-workspace/create-workspace'
import DeleteWorkspace from '@core/use-cases/delete-workspace/delete-workspace'

import ShowDirectoryEntry from '@core/use-cases/show-directory-entry/show-directory-entry'

import WorkspaceRepository from './repositories/workspace-repository'

import FSDrive from './gateways/fs-drive'

interface IUseCase {
    execute(args:any): Promise<any>
}

const workspaceRepository = new WorkspaceRepository(
    path.resolve(app.getPath('userData'), 'workspaces.json')
)

const fsDrive = new FSDrive()
const driveManager = new DriveManager({ fs: fsDrive })

const options: Record<string, IUseCase> = {
    'list-workspaces': new ListWorkspaces(workspaceRepository),
    'create-workspace': new CreateWorkspace(workspaceRepository, driveManager),
    'delete-workspace': new DeleteWorkspace(workspaceRepository),
    'show-directory-entry': new ShowDirectoryEntry(workspaceRepository, driveManager)
}

export default options