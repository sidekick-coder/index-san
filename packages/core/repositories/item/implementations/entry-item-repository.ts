import uniqBy from 'lodash/uniqBy'

import Collection from '../../../entities/collection'
import Item from '../../../entities/item'
import DriveManager from '../../../gateways/drive/manager'
import IItemRepository from '../item-repository'
import DirectoryEntry from '../../../entities/directory-entry'
import ItemNotFound from '../../../exceptions/item-not-found'

interface ItemMeta {
    id: string
    [key: string]: any
}

export default class EntryItemRepository implements IItemRepository {
    constructor(public readonly drive: DriveManager) {}

    public async listMetas(collection: Collection): Promise<ItemMeta[]> {
        const content = await this.drive.readAsString(collection.path, '.is', 'metas.json')

        return content ? JSON.parse(content) : []
    }

    public async saveMetas(collection: Collection, metas: ItemMeta[]) {
        const filename = DirectoryEntry.normalize(collection.path, '.is', 'metas.json')

        await this.drive.write(filename, JSON.stringify(uniqBy(metas, 'id'), null, 4))
    }

    public async list(collection: Collection): Promise<Item[]> {
        const entries = await this.drive.list(collection.path)
        const metas = await this.listMetas(collection)

        return entries
            .filter((e) => e.name !== '.is')
            .filter((e) => e.type === 'directory')
            .map((e) => e.name)
            .map((id) => {
                const meta = metas.find((i) => i.id === id)

                return new Item(meta, id)
            })
    }

    public async show(collection: Collection, id: string): Promise<Item> {
        const items = await this.list(collection)

        const item = items.find((i) => i.id === id)

        if (!item) {
            throw new ItemNotFound(collection.id, id)
        }

        return item
    }

    public async create(collection: Collection, payload: Item): Promise<Item> {
        const item = new Item(payload, payload.id)

        item._createdAt = new Date().toString()
        item._updateAt = new Date().toString()

        await this.drive.mkdir(collection.path, item.id)

        const metas = await this.listMetas(collection)

        metas.push(item)

        await this.saveMetas(collection, metas)

        return item
    }

    public async update(collection: Collection, id: string, payload: Partial<Item>): Promise<Item> {
        const item = await this.show(collection, id)

        if (!item) {
            throw new ItemNotFound(collection.id, id)
        }

        Object.assign(item, payload)

        item._updatedAt = new Date().toString()

        const metas = await this.listMetas(collection)

        const index = metas.findIndex((m) => m.id === id)

        if (index === -1) metas.push(item)

        if (index !== -1) metas.splice(index, 1, item)

        await this.saveMetas(collection, metas)

        if (item.id !== id) {
            const source = DirectoryEntry.normalize(collection.path, id)
            const target = DirectoryEntry.normalize(collection.path, item.id)

            await this.drive.move(source, target)
        }

        return item
    }

    public async destroy(collection: Collection, id: string): Promise<void> {
        const item = await this.show(collection, id)

        if (!item) {
            throw new ItemNotFound(collection.id, id)
        }

        const metas = await this.listMetas(collection)

        const index = metas.findIndex((m) => m.id === id)

        if (index !== -1) metas.splice(index, 1)

        await this.saveMetas(collection, metas)

        await this.drive.delete(collection.path, id)
    }
}
