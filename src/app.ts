import IItemsRepository from 'Repositories/IItemsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

import IRowProvider from 'Providers/IRowProvider'

import CreateWorkspace from 'UseCases/CreateWorkspace'
import DeleteWorkspace from 'UseCases/DeleteWorkspace'
import ListWorkspaces from 'UseCases/ListWorkspaces'

import ListItems from 'UseCases/ListItems'
import ShowItem from 'UseCases/ShowItem'
import CreateItem from 'UseCases/CreateItem'
import UpdateItem from 'UseCases/UpdateItem'
import DeleteItem from 'UseCases/DeleteItem'
import IDatabaseTableRepository from 'Repositories/IDatabaseTableRepository'

import ListDatabaseTables from 'UseCases/ListDatabaseTables'
import ShowDatabaseTable from 'UseCases/ShowDatabaseTable'
import CreateDatabaseTable from 'UseCases/CreateDatabaseTable'
import UpdateDatabaseTable from 'UseCases/UpdateDatabaseTable'
import DeleteDatabaseTable from 'UseCases/DeleteDatabaseTable'

import ListTableRows from 'UseCases/ListTableRows'

interface UseCaseExecute {
  execute(payload: any): Promise<any>
}

export default class Application {
  private _useCases = new Map<string, UseCaseExecute>()

  constructor(
    public workspaceRepository: IWorkspacesRepository,
    public itemsRepository: IItemsRepository,
    public databaseTableRepository: IDatabaseTableRepository,

    public rowProvider: IRowProvider
  ) {
    this._useCases.set('create-workspace', new CreateWorkspace(workspaceRepository))
    this._useCases.set('list-workspaces', new ListWorkspaces(workspaceRepository))
    this._useCases.set('delete-workspace', new DeleteWorkspace(workspaceRepository))

    this._useCases.set('list-items', new ListItems(itemsRepository))
    this._useCases.set('show-item', new ShowItem(itemsRepository))
    this._useCases.set('create-item', new CreateItem(itemsRepository))
    this._useCases.set('update-item', new UpdateItem(itemsRepository))
    this._useCases.set('delete-item', new DeleteItem(itemsRepository))

    this._useCases.set('list-database-tables', new ListDatabaseTables(databaseTableRepository))
    this._useCases.set('show-database-table', new ShowDatabaseTable(databaseTableRepository))
    this._useCases.set('create-database-table', new CreateDatabaseTable(databaseTableRepository))
    this._useCases.set('update-database-table', new UpdateDatabaseTable(databaseTableRepository))
    this._useCases.set('delete-database-table', new DeleteDatabaseTable(databaseTableRepository))

    this._useCases.set('list-table-rows', new ListTableRows(databaseTableRepository, rowProvider))
  }

  public useCase<T>(name: string, payload: any) {
    const useCase = this._useCases.get(name)

    if (!useCase) {
      throw new Error(`Use case ${name} not found`)
    }

    return useCase.execute.bind(useCase)(payload) as Promise<T>
  }
}
