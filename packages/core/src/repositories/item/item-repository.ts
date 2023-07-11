import Collection from '../../entities/collection'
import Item from '../../entities/item'

export default interface IItemRepository {
    collection: Collection
    list(): Promise<Item[]>
    show(id: Item['id']): Promise<Item>
    create(payload: Item): Promise<Item>
    update(id: Item['id'], payload: Partial<Item>): Promise<Item>
    destroy(id: Item['id']): Promise<void>
}
