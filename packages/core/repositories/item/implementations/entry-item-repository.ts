import uniqBy from 'lodash/uniqBy'

import Collection from '../../../entities/collection'
import Item from '../../../entities/item'
import DirectoryEntry from '../../../entities/directory-entry'
import ItemNotFound from '../../../exceptions/item-not-found'
import Drive from '../../../gateways/drive/drive'
import IItemRepository from '../item-repository'

interface ItemMeta {
    id: string
    [key: string]: any
}

export default class EntryItemRepository implements IItemRepository {
    constructor(public collection: Collection, public readonly drive: Drive) {}

    public async listMetas(): Promise<ItemMeta[]> {
        const filename = DirectoryEntry.normalize(this.collection.path, '.is', 'metas.json')

        const content = await this.drive.read(filename)

        return content ? JSON.parse(DirectoryEntry.decode(content)) : []
    }

    public async saveMetas(metas: ItemMeta[]) {
        const filename = DirectoryEntry.normalize(this.collection.path, '.is', 'metas.json')

        await this.drive.write(filename, DirectoryEntry.encode(uniqBy(metas, 'id')))
    }

    public async list(): Promise<Item[]> {
        const entries = await this.drive.list(this.collection.path)
        const metas = await this.listMetas()

        return entries
            .filter((e) => e.name !== '.is')
            .filter((e) => e.type === 'directory')
            .map((e) => e.name)
            .map((id) => {
                const meta = metas.find((i) => i.id === id)

                const item = new Item(meta, id)

                item._path = DirectoryEntry.normalize(this.collection.path, id)

                return item
            })
    }

    public async show(id: string): Promise<Item> {
        const items = await this.list()

        const item = items.find((i) => i.id === id)

        if (!item) {
            throw new ItemNotFound(this.collection.id, id)
        }

        return item
    }

    public async create(payload: Item): Promise<Item> {
        const item = new Item(payload, payload.id)

        item._createdAt = new Date().toString()
        item._updateAt = new Date().toString()

        await this.drive.mkdir(DirectoryEntry.normalize(this.collection.path, item.id))

        const metas = await this.listMetas()

        metas.push(item)

        await this.saveMetas(metas)

        return item
    }

    public async update(id: string, payload: Partial<Item>): Promise<Item> {
        const item = await this.show(id)

        if (!item) {
            throw new ItemNotFound(this.collection.id, id)
        }

        Object.assign(item, payload)

        item._createdAt = item._createdAt || new Date().toString()
        item._updatedAt = new Date().toString()

        const metas = await this.listMetas()

        const index = metas.findIndex((m) => m.id === id)

        if (index === -1) metas.push(item)

        if (index !== -1) metas.splice(index, 1, item)

        await this.saveMetas(metas)

        if (item.id !== id) {
            const source = DirectoryEntry.normalize(this.collection.path, id)
            const target = DirectoryEntry.normalize(this.collection.path, item.id)

            await this.drive.move(source, target)
        }

        return item
    }

    public async destroy(id: string): Promise<void> {
        const item = await this.show(id)

        if (!item) {
            throw new ItemNotFound(this.collection.id, id)
        }

        const metas = await this.listMetas()

        const index = metas.findIndex((m) => m.id === id)

        if (index !== -1) metas.splice(index, 1)

        await this.saveMetas(metas)

        await this.drive.delete(DirectoryEntry.normalize(this.collection.path, id))
    }
}
