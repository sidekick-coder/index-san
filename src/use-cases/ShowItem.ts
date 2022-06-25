import ItemNotFound from 'Errors/ItemNotFound'
import IItemsRepository from 'Repositories/IItemsRepository'

interface Params {
  id: string
  workspaceId: string
  responseType?: 'object' | 'buffer'
}

export default class ShowItem {
  constructor(public repository: IItemsRepository) {}

  public async execute({ id, workspaceId, responseType }: Params) {
    const item = await this.repository.findOne({
      where: {
        id,
        workspaceId,
      },
    })

    if (!item) throw new ItemNotFound()

    if (responseType === 'buffer' && item.type !== 'file') {
      throw new Error('buffer only allowed for files')
    }

    if (responseType === 'buffer') {
      return this.repository.drive.get(item)
    }

    return item
  }
}
