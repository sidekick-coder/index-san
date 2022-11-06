import IWorkspaceRepository from './repositories/workspace-repository'
import DriveManager from './gateways/drive-manager'
import CrudManager from './gateways/crud-manager'

import ListWorkspaces from './use-cases/list-workspaces/list-workspaces'
import CreateWorkspace from './use-cases/create-workspace/create-workspace'
import DeleteWorkspace from './use-cases/delete-workspace/delete-workspace'

import ShowWorkspaceOptions from './use-cases/show-workspace-options/show-workspace-options'
import UpdateWorkspaceOptions from './use-cases/update-workspace-options/update-workspace-options'

import ShowDirectoryEntry from './use-cases/show-directory-entry/show-directory-entry'
import ListDirectoryEntry from './use-cases/list-directory-entry/list-directory-entry'
import ReadDirectoryEntry from './use-cases/read-directory-entry/read-directory-entry'
import CreateDirectoryEntry from './use-cases/create-directory-entry/create-directory-entry'
import WriteDirectoryEntry from './use-cases/write-directory-entry/write-directory-entry'
import DeleteDirectoryEntry from './use-cases/delete-directory-entry/delete-directory-entry'

import ListCollections from './use-cases/list-collections/list-collections'
import ShowCollection from './use-cases/show-collection/show-collection'
import UpdateCollection from './use-cases/update-collection/update-collection'
import CreateCollection from './use-cases/create-collection/create-collection'
import DeleteCollection from './use-cases/delete-collection/delete-collection'

import ListItems from './use-cases/list-items/list-items'
import ShowItem from './use-cases/show-item/show-item'
import CreateItem from './use-cases/create-item/create-item'
import UpdateItem from './use-cases/update-item/update-item'
import DeleteItem from './use-cases/delete-item/delete-item'

interface AppArgs {
    workspaceRepository: IWorkspaceRepository
    driveManager: DriveManager
    crudManger: CrudManager
}

interface AppRepositories {
    workspace: IWorkspaceRepository
}

interface AppManagers {
    drive: DriveManager
    crud: CrudManager
}

interface AppUseCases {
    'list-workspaces': ListWorkspaces,
    'create-workspace': CreateWorkspace,
    'delete-workspace': DeleteWorkspace,

    'show-workspace-options': ShowWorkspaceOptions,
    'update-workspace-options': UpdateWorkspaceOptions,

    'list-directory-entry': ListDirectoryEntry 
    'show-directory-entry': ShowDirectoryEntry,
    'read-directory-entry': ReadDirectoryEntry,
    'create-directory-entry': CreateDirectoryEntry,
    'write-directory-entry': WriteDirectoryEntry,
    'delete-directory-entry': DeleteDirectoryEntry,

    'list-collections': ListCollections,
    'show-collection': ShowCollection,
    'create-collection': CreateCollection,
    'update-collection': UpdateCollection,
    'delete-collection': DeleteCollection,

    'list-items': ListItems,
    'show-item': ShowItem,
    'create-item': CreateItem,
    'update-item': UpdateItem,
    'delete-item': DeleteItem
}

export default class App {
    public repositories: AppRepositories
    public managers: AppManagers
    
    public cases: AppUseCases

    constructor({ workspaceRepository, driveManager, crudManger }: AppArgs){
        this.repositories= {
            workspace: workspaceRepository
        }

        this.managers = {
            drive: driveManager,
            crud: crudManger
        }

        this.cases = {
            'list-workspaces': new ListWorkspaces(workspaceRepository),
            'create-workspace': new CreateWorkspace(workspaceRepository, driveManager),
            'delete-workspace': new DeleteWorkspace(workspaceRepository),

            'show-workspace-options': new ShowWorkspaceOptions(workspaceRepository, driveManager),
            'update-workspace-options': new UpdateWorkspaceOptions(workspaceRepository, driveManager),

            'list-directory-entry': new ListDirectoryEntry(workspaceRepository, driveManager),    
            'show-directory-entry': new ShowDirectoryEntry(workspaceRepository, driveManager),
            'read-directory-entry': new ReadDirectoryEntry(workspaceRepository, driveManager),
            'create-directory-entry': new CreateDirectoryEntry(workspaceRepository, driveManager),
            'write-directory-entry': new WriteDirectoryEntry(workspaceRepository, driveManager),
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
    }
}