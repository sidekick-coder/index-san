import IItemsRepository from 'Repositories/IItemsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import CreateItem from 'UseCases/CreateItem'
import CreateWorkspace from 'UseCases/CreateWorkspace'
import DeleteWorkspace from 'UseCases/DeleteWorkspace'
import ListItems from 'UseCases/list-items'
import ListWorkspaces from 'UseCases/ListWorkspaces'
import ShowItem from 'UseCases/show-item'

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

    this._useCases.set('create-item', new CreateItem(workspaceRepository, itemsRepository))
    this._useCases.set('list-items', new ListItems(itemsRepository))
    this._useCases.set('show-item', new ShowItem(itemsRepository))
  }

  public useCase<T>(name: string, payload: any) {
    const useCase = this._useCases.get(name)

    if (!useCase) {
      throw new Error(`Use case ${name} not found`)
    }

    return useCase.execute.bind(useCase)(payload) as Promise<T>
  }
}
