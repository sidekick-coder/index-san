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
import ShowMenu from './use-cases/show-menu/show-menu'
import UpdateMenu from './use-cases/update-menu/update-menu'
import UpdateDirectoryEntry from './use-cases/update-directory-entry/update-directory-entry'
import ShowViews from './use-cases/show-views/show-views'
import UpdateViews from './use-cases/update-views/update-views'

interface AppArgs {
    workspaceRepository: IWorkspaceRepository
    driveManager: DriveManager
    crudManger: CrudManager
}

function createUseCases(app: AppService) {
    return {
        'list-workspaces': new ListWorkspaces(app.repositories.workspace),
        'create-workspace': new CreateWorkspace(app.repositories.workspace, app.managers.drive),
        'delete-workspace': new DeleteWorkspace(app.repositories.workspace),

        'show-workspace-options': new ShowWorkspaceOptions(app),
        'update-workspace-options': new UpdateWorkspaceOptions(app),

        'list-directory-entry': new ListDirectoryEntry(app),
        'show-directory-entry': new ShowDirectoryEntry(app),
        'update-directory-entry': new UpdateDirectoryEntry(app),
        'create-directory-entry': new CreateDirectoryEntry(app),
        'delete-directory-entry': new DeleteDirectoryEntry(app),
        'read-directory-entry': new ReadDirectoryEntry(app),
        'write-directory-entry': new WriteDirectoryEntry(app),

        'list-collections': new ListCollections(app),
        'show-collection': new ShowCollection(app),
        'create-collection': new CreateCollection(app),
        'update-collection': new UpdateCollection(app),
        'delete-collection': new DeleteCollection(app),

        'list-items': new ListItems(app),
        'show-item': new ShowItem(app),
        'create-item': new CreateItem(app),
        'update-item': new UpdateItem(app),
        'delete-item': new DeleteItem(app),

        'list-scripts': new ListScripts(app),
        'create-script': new CreateScript(app),
        'update-script': new UpdateScript(app),
        'delete-script': new DeleteScript(app),
        'execute-script': new ExecuteScript(app),

        'show-menu': new ShowMenu(app),
        'update-menu': new UpdateMenu(app),

        'show-views': new ShowViews(app),
        'update-views': new UpdateViews(app),
    }
}

export default class App extends AppService {
    public cases: ReturnType<typeof createUseCases>

    constructor({ workspaceRepository, driveManager, crudManger }: AppArgs) {
        super({ workspaceRepository, driveManager, crudManger })

        this.cases = createUseCases(this)
    }
}
