import Item from 'Entities/Item'

export default interface IItemsRepository {
  create(item: Item): Promise<Item>
}
