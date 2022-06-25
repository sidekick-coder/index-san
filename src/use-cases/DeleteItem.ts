import ItemNotFound from 'Errors/ItemNotFound'
import IItemsRepository from 'Repositories/IItemsRepository'

interface Params {
  id: string
  workspaceId: string
}

export default class DeleteItem {
  constructor(public repository: IItemsRepository) {}

  public async execute({ id, workspaceId }: Params) {
    const item = await this.repository.findOne({
      where: { id, workspaceId },
    })

    if (!item) throw new ItemNotFound()

    await this.repository.delete(item)
  }
}
