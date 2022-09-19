import { app } from 'electron'
import path from 'path'

import DriveManager from '@core/gateways/drive-manager'

import ListWorkspaces from '@core/use-cases/list-workspaces/list-workspaces'
import CreateWorkspace from '@core/use-cases/create-workspace/create-workspace'
import DeleteWorkspace from '@core/use-cases/delete-workspace/delete-workspace'

import ShowDirectoryEntry from '@core/use-cases/show-directory-entry/show-directory-entry'
import ListDirectoryEntry from '@core/use-cases/list-directory-entry/list-directory-entry'
import CreateDirectoryEntry from '@core/use-cases/create-directory-entry/create-directory-entry'
import DeleteDirectoryEntry from '@core/use-cases/delete-directory-entry/delete-directory-entry'

import ListCollections from '@core/use-cases/list-collections/list-collections'
import CreateCollection from '@core/use-cases/create-collection/create-collection'
import DeleteCollection from '@core/use-cases/delete-collection/delete-collection'

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

    'list-directory-entry': new ListDirectoryEntry(workspaceRepository, driveManager),    
    'show-directory-entry': new ShowDirectoryEntry(workspaceRepository, driveManager),
    'create-directory-entry': new CreateDirectoryEntry(workspaceRepository, driveManager),
    'delete-directory-entry': new DeleteDirectoryEntry(workspaceRepository, driveManager),

    'list-collections': new ListCollections(workspaceRepository, driveManager),
    'create-collection': new CreateCollection(workspaceRepository, driveManager),
    'delete-collection': new DeleteCollection(workspaceRepository, driveManager)
}

export default options