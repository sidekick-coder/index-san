import ItemIsNotAFile from 'Errors/ItemIsNotAFile'
import ItemNotFound from 'Errors/ItemNotFound'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IItemsRepository from 'Repositories/IItemsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import IDrive from 'src/providers/IDrive'

interface Args {
  workspaceId: string
  path: string
}

export default class ShowItemFile {
  constructor(
    private workspacesRepository: IWorkspacesRepository,
    private itemsRepository: IItemsRepository,
    private readonly drive: IDrive
  ) {}

  public async execute({ workspaceId, path }: Args) {
    const workspace = await this.workspacesRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound(workspaceId)

    const item = await this.itemsRepository.findByPath(workspace, path)

    if (!item) throw new ItemNotFound(workspaceId, path)

    if (item.type !== 'file') throw new ItemIsNotAFile(item.path)

    return this.drive.get(workspace, item.path)
  }
}
