import IItemsRepository, { Filters } from 'Repositories/IItemsRepository'

export default class ListItems {
  constructor(private itemsRepository: IItemsRepository) {}

  public async execute(filters?: Filters) {
    return await this.itemsRepository.index(filters)
  }
}
