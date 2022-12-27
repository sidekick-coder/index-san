import Collection from '../../entities/collection'
import Item from '../../entities/item'

export default interface IItemRepository {
    list(collection: Collection): Promise<Item[]>
    show(collection: Collection, id: Item['id']): Promise<Item>
    create(collection: Collection, payload: Item): Promise<Item>
    update(collection: Collection, id: Item['id'], payload: Partial<Item>): Promise<Item>
    destroy(collection: Collection, id: Item['id']): Promise<void>
}
