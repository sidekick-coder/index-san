import ItemIsNotAFile from 'Errors/ItemIsNotAFile'
import ItemNotFound from 'Errors/ItemNotFound'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IDrive from 'Providers/IDrive'
import IItemsRepository from 'Repositories/IItemsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

interface Args {
  workspaceId: string
  path: string
  content: Buffer | string
}

export default class UpdateItemFile {
  constructor(
    private workspacesRepository: IWorkspacesRepository,
    private itemsRepository: IItemsRepository,
    private drive: IDrive
  ) {}

  async execute({ workspaceId, path, content }: Args) {
    const workspace = await this.workspacesRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound(workspaceId)

    const item = await this.itemsRepository.findByPath(workspace, path)

    if (!item) throw new ItemNotFound(workspaceId, path)

    if (item.type !== 'file') throw new ItemIsNotAFile(path)

    await this.drive.update(workspace, item.path, content)
  }
}
