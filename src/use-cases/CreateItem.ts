import IItemsRepository from 'Repositories/IItemsRepository'

interface Params {
  id: string
  workspaceId: string
  name: string
  type: string
  content?: Buffer
}

export default class CreateItem {
  constructor(public itemsRepository: IItemsRepository) {}

  public async execute({ workspaceId, id, name, type, content }: Params) {
    if (type !== 'folder' && type !== 'file') throw new Error('invalid type')

    if (type === 'folder' && content) throw new Error('content is only allowed for type file')

    const item = await this.itemsRepository.create(
      {
        id,
        workspaceId,
        name,
        type,
      },
      content
    )

    return item
  }
}
