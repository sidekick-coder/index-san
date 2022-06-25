import IItemsRepository from 'Repositories/IItemsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

import CreateWorkspace from 'UseCases/CreateWorkspace'
import DeleteWorkspace from 'UseCases/DeleteWorkspace'
import ListWorkspaces from 'UseCases/ListWorkspaces'

import ListItems from 'UseCases/ListItems'
import ShowItem from 'UseCases/ShowItem'
import CreateItem from 'UseCases/CreateItem'
import UpdateItem from 'UseCases/UpdateItem'
import DeleteItem from 'UseCases/DeleteItem'

interface UseCaseExecute {
  execute(payload: any): Promise<any>
}

export default class Application {
  private _useCases = new Map<string, UseCaseExecute>()

  constructor(
    public workspaceRepository: IWorkspacesRepository,
    public itemsRepository: IItemsRepository
  ) {
    this._useCases.set('create-workspace', new CreateWorkspace(workspaceRepository))
    this._useCases.set('list-workspaces', new ListWorkspaces(workspaceRepository))
    this._useCases.set('delete-workspace', new DeleteWorkspace(workspaceRepository))

    this._useCases.set('list-items', new ListItems(itemsRepository))
    this._useCases.set('show-item', new ShowItem(itemsRepository))
    this._useCases.set('create-item', new CreateItem(itemsRepository))
    this._useCases.set('update-item', new UpdateItem(itemsRepository))
    this._useCases.set('delete-item', new DeleteItem(itemsRepository))
  }

  public useCase<T>(name: string, payload: any) {
    const useCase = this._useCases.get(name)

    if (!useCase) {
      throw new Error(`Use case ${name} not found`)
    }

    return useCase.execute.bind(useCase)(payload) as Promise<T>
  }
}
