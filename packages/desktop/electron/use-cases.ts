import { app } from 'electron'
import path from 'path'

import ListWorkspaces from '@core/use-cases/list-workspaces/list-workspaces'
import CreateWorkspace from '@core/use-cases/create-workspace/create-workspace'
import DeleteWorkspace from '@core/use-cases/delete-workspace/delete-workspace'

import ShowWorkspaceOptions from '@core/use-cases/show-workspace-options/show-workspace-options'
import UpdateWorkspaceOptions from '@core/use-cases/update-workspace-options/update-workspace-options'

import ShowDirectoryEntry from '@core/use-cases/show-directory-entry/show-directory-entry'
import ListDirectoryEntry from '@core/use-cases/list-directory-entry/list-directory-entry'
import CreateDirectoryEntry from '@core/use-cases/create-directory-entry/create-directory-entry'
import DeleteDirectoryEntry from '@core/use-cases/delete-directory-entry/delete-directory-entry'

import ListCollections from '@core/use-cases/list-collections/list-collections'
import ShowCollection from '@core/use-cases/show-collection/show-collection'
import UpdateCollection from '@core/use-cases/update-collection/update-collection'
import CreateCollection from '@core/use-cases/create-collection/create-collection'
import DeleteCollection from '@core/use-cases/delete-collection/delete-collection'

import ListItems from '@core/use-cases/list-items/list-items'
import ShowItem from '@core/use-cases/show-item/show-item'
import CreateItem from '@core/use-cases/create-item/create-item'
import UpdateItem from '@core/use-cases/update-item/update-item'
import DeleteItem from '@core/use-cases/delete-item/delete-item'

import WorkspaceRepository from './repositories/workspace-repository'

import DriveManager from '@core/gateways/drive-manager'
import CrudManager from '@core/gateways/crud-manager'

import FSDrive from './gateways/fs-drive'
import FSCrudFolder from './gateways/fs-crud-folder'

interface IUseCase {
    execute(args:any): Promise<any>
}

const workspaceRepository = new WorkspaceRepository(
    path.resolve(app.getPath('userData'), 'workspaces.json')
)

const fsDrive = new FSDrive()
const fsCrudFolder = new FSCrudFolder()
const driveManager = new DriveManager({ fs: fsDrive })
const crudManger = new CrudManager({ fsFolder: fsCrudFolder })

const options: Record<string, IUseCase> = {
    'list-workspaces': new ListWorkspaces(workspaceRepository),
    'create-workspace': new CreateWorkspace(workspaceRepository, driveManager),
    'delete-workspace': new DeleteWorkspace(workspaceRepository),

    'show-workspace-options': new ShowWorkspaceOptions(workspaceRepository, driveManager),
    'update-workspace-options': new UpdateWorkspaceOptions(workspaceRepository, driveManager),

    'list-directory-entry': new ListDirectoryEntry(workspaceRepository, driveManager),    
    'show-directory-entry': new ShowDirectoryEntry(workspaceRepository, driveManager),
    'create-directory-entry': new CreateDirectoryEntry(workspaceRepository, driveManager),
    'delete-directory-entry': new DeleteDirectoryEntry(workspaceRepository, driveManager),

    'list-collections': new ListCollections(workspaceRepository, driveManager),
    'show-collection': new ShowCollection(workspaceRepository, driveManager),
    'create-collection': new CreateCollection(workspaceRepository, driveManager),
    'update-collection': new UpdateCollection(workspaceRepository, driveManager),
    'delete-collection': new DeleteCollection(workspaceRepository, driveManager),

    'list-items': new ListItems(driveManager, crudManger, workspaceRepository),
    'show-item': new ShowItem(driveManager, crudManger, workspaceRepository),
    'create-item': new CreateItem(driveManager, crudManger ,workspaceRepository),
    'update-item': new UpdateItem(driveManager,crudManger, workspaceRepository),
    'delete-item': new DeleteItem(driveManager, crudManger, workspaceRepository)
}

export default options