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
import AppService from './services/app-service'
import ListScripts from './use-cases/list-scripts/list-scripts'
import CreateScript from './use-cases/create-script/create-script'
import UpdateScript from './use-cases/update-script/update-script'
import DeleteScript from './use-cases/delete-script/delete-script'
import ExecuteScript from './use-cases/execute-script/execute-script'

interface AppArgs {
    workspaceRepository: IWorkspaceRepository
    driveManager: DriveManager
    crudManger: CrudManager
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
    'delete-item': DeleteItem,

    'list-scripts': ListScripts
    'create-script': CreateScript
    'update-script': UpdateScript
    'delete-script': DeleteScript
    'execute-script': ExecuteScript
}

export default class App extends AppService {
    
    public cases: AppUseCases

    constructor({ workspaceRepository, driveManager, crudManger }: AppArgs){
        
        super({ workspaceRepository, driveManager, crudManger })

        this.cases = {
            'list-workspaces': new ListWorkspaces(workspaceRepository),
            'create-workspace': new CreateWorkspace(workspaceRepository, driveManager),
            'delete-workspace': new DeleteWorkspace(workspaceRepository),

            'show-workspace-options': new ShowWorkspaceOptions(this),
            'update-workspace-options': new UpdateWorkspaceOptions(this),

            'list-directory-entry': new ListDirectoryEntry(this),    
            'show-directory-entry': new ShowDirectoryEntry(this),
            'read-directory-entry': new ReadDirectoryEntry(this),
            'create-directory-entry': new CreateDirectoryEntry(this),
            'write-directory-entry': new WriteDirectoryEntry(this),
            'delete-directory-entry': new DeleteDirectoryEntry(this),

            'list-collections': new ListCollections(this),
            'show-collection': new ShowCollection(this),
            'create-collection': new CreateCollection(this),
            'update-collection': new UpdateCollection(this),
            'delete-collection': new DeleteCollection(this),

            'list-items': new ListItems(this),
            'show-item': new ShowItem(this),
            'create-item': new CreateItem(this),
            'update-item': new UpdateItem(this),
            'delete-item': new DeleteItem(this),

            'list-scripts': new ListScripts(this),
            'create-script': new CreateScript(this),
            'update-script': new UpdateScript(this),
            'delete-script': new DeleteScript(this),
            'execute-script': new ExecuteScript(this)
        }
    }
}