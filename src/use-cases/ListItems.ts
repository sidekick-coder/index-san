import IItemsRepository, { Filters } from 'Repositories/IItemsRepository'

export default class ListItems {
  constructor(public repository: IItemsRepository) {}

  public execute(filters?: Filters) {
    return this.repository.index(filters)
  }
}
