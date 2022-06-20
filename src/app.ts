import IItemsRepository from 'Repositories/IItemsRepository'
import IMetadataRepository from 'Repositories/IMetadataRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import CreateItem from 'UseCases/create-item'
import CreateWorkspace from 'UseCases/create-workspace'
import DeleteWorkspace from 'UseCases/delete-workspace'
import ListItems from 'UseCases/list-items'
import ListWorkspaces from 'UseCases/list-workspaces'
import SaveItemMetadata from 'UseCases/save-item-metadata'
import ShowItem from 'UseCases/show-item'

interface UseCaseExecute {
  execute(payload: any): Promise<any>
}

export default class Application {
  private _useCases = new Map<string, UseCaseExecute>()

  constructor(
    public workspaceRepository: IWorkspacesRepository,
    public itemsRepository: IItemsRepository,
    public metadataRepository: IMetadataRepository
  ) {
    this._useCases.set('create-workspace', new CreateWorkspace(workspaceRepository))
    this._useCases.set('list-workspaces', new ListWorkspaces(workspaceRepository))
    this._useCases.set('delete-workspace', new DeleteWorkspace(workspaceRepository))

    this._useCases.set('create-item', new CreateItem(workspaceRepository, itemsRepository))
    this._useCases.set('list-items', new ListItems(itemsRepository))
    this._useCases.set('show-item', new ShowItem(itemsRepository))
    this._useCases.set('save-item-metadata', new SaveItemMetadata(metadataRepository))
  }

  public useCase<T>(name: string, payload: any) {
    const useCase = this._useCases.get(name)

    if (!useCase) {
      throw new Error(`Use case ${name} not found`)
    }

    return useCase.execute.bind(useCase)(payload) as Promise<T>
  }
}
