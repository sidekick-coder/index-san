import ListDrives from './use-cases/list-drives/list-drives'

import ListWorkspaces from './use-cases/list-workspaces/list-workspaces'
import CreateWorkspace from './use-cases/create-workspace/create-workspace'
import UpdateWorkspace from './use-cases/update-workspace/update-workspace'
import DeleteWorkspace from './use-cases/delete-workspace/delete-workspace'

import ShowWorkspaceOptions from './use-cases/show-workspace-options/show-workspace-options'
import UpdateWorkspaceOptions from './use-cases/update-workspace-options/update-workspace-options'

import ShowDirectoryEntry from './use-cases/show-directory-entry/show-directory-entry'
import ListDirectoryEntry from './use-cases/list-directory-entry/list-directory-entry'
import ReadDirectoryEntry from './use-cases/read-directory-entry/read-directory-entry'
import CreateDirectoryEntry from './use-cases/create-directory-entry/create-directory-entry'
import CopyDirectoryEntry from './use-cases/copy-directory-entry/copy-directory-entry'
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

import ExecuteScript from './use-cases/execute-script/execute-script'

import ShowMenu from './use-cases/show-menu/show-menu'
import UpdateMenu from './use-cases/update-menu/update-menu'
import UpdateDirectoryEntry from './use-cases/update-directory-entry/update-directory-entry'
import ShowViews from './use-cases/show-views/show-views'
import UpdateViews from './use-cases/update-views/update-views'
import AppConfig from './config/app'
import MoveDirectoryEntry from './use-cases/move-directory-entry/move-directory-entry'

function createUseCases(app: AppConfig) {
    return {
        'list-drives': new ListDrives(app),

        'list-workspaces': new ListWorkspaces(app),
        'create-workspace': new CreateWorkspace(app),
        'update-workspace': new UpdateWorkspace(app),
        'delete-workspace': new DeleteWorkspace(app),

        'show-workspace-options': new ShowWorkspaceOptions(app),
        'update-workspace-options': new UpdateWorkspaceOptions(app),

        'list-directory-entry': new ListDirectoryEntry(app),
        'show-directory-entry': new ShowDirectoryEntry(app),
        'create-directory-entry': new CreateDirectoryEntry(app),
        'copy-directory-entry': new CopyDirectoryEntry(app),
        'move-directory-entry': new MoveDirectoryEntry(app),
        'update-directory-entry': new UpdateDirectoryEntry(app),
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

        'execute-script': new ExecuteScript(app),

        'show-menu': new ShowMenu(app),
        'update-menu': new UpdateMenu(app),

        'show-views': new ShowViews(app),
        'update-views': new UpdateViews(app),
    }
}

export type Cases = ReturnType<typeof createUseCases>

export type CasesKeys = keyof ReturnType<typeof createUseCases>

export type CasesMethod<K extends CasesKeys> = ReturnType<Cases[K]['execute']>

export type CasesParams<K extends CasesKeys> = Parameters<Cases[K]['execute']>[0]

export default class App {
    public cases: ReturnType<typeof createUseCases>

    constructor(props: AppConfig) {
        this.cases = createUseCases(props)
    }

    public useCase<K extends CasesKeys, T = CasesMethod<K>>(
        name: K,
        args: CasesParams<K>
    ): Promise<Awaited<T>> {
        const option = this.cases[name]

        return option.execute(args as any) as any
    }
}