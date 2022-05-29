import ItemNotFound from 'Errors/ItemNotFound'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import { IDataViewConstructor, UseCase } from 'Providers/IDataView'
import IItemsRepository from 'Repositories/IItemsRepository'
import IMetadataRepository from 'Repositories/IMetadataRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import ListItems from './list-items'

interface Args {
  workspaceId: string
  path: string
}

export default class ShowItemDataView {
  constructor(
    public workspacesRepository: IWorkspacesRepository,
    public itemsRepository: IItemsRepository,
    public metadataRepository: IMetadataRepository,
    public DataView: IDataViewConstructor
  ) {}

  public useCase: UseCase = async (name: string, args?: any) => {
    const cases: Record<string, ListItems> = {
      'list-items': new ListItems(
        this.workspacesRepository,
        this.itemsRepository,
        this.metadataRepository
      ),
    }

    if (!cases[name]) throw new Error(`Case "${name}" not found`)

    return cases[name].execute(args)
  }

  public async execute({ workspaceId, path }: Args) {
    const workspace = await this.workspacesRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound(workspaceId)

    const item = await this.itemsRepository.findByPath(workspace, path)

    if (!item) throw new ItemNotFound(workspaceId, path)

    const metas = await this.metadataRepository.index(workspace, {
      paths: [item.path],
    })

    item.metas = metas[item.path]

    const dataView = new this.DataView(item, workspace, this.useCase)

    const head = await dataView.head()

    const items = await dataView.index()

    return {
      head,
      items,
    }
  }
}
