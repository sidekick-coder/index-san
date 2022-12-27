import Collection from '../../../entities/collection'
import CollectionNotFound from '../../../exceptions/collection-not-found'
import DriveManager from '../../../gateways/drive/manager'
import ICollectionRepository from '../collection-repository'

export default class CollectionRepository implements ICollectionRepository {
    constructor(public readonly drive: DriveManager) {}

    public async save(collections: Collection[]) {
        await this.drive.write('.is/collections.json', JSON.stringify(collections, null, 4))
    }

    public async list(): Promise<Collection[]> {
        const content = await this.drive.readAsString('.is/collections.json')

        return content ? JSON.parse(content) : []
    }

    public async show(id: string): Promise<Collection | null> {
        const collections = await this.list()

        const collection = collections.find((c) => c.id === id)

        return collection || null
    }

    public async create(payload: Collection): Promise<Collection> {
        const collections = await this.list()

        collections.push(payload)

        await this.save(collections)

        return payload
    }

    public async update(id: Collection['id'], payload: Partial<Collection>): Promise<Collection> {
        const collections = await this.list()

        const collection = collections.find((c) => c.id === id)

        if (!collection) {
            throw new CollectionNotFound(id)
        }

        Object.assign(collection, payload)

        await this.save(collections)

        return collection
    }

    public async destroy(id: Collection['id']): Promise<void> {
        const collections = await this.list()

        const index = collections.findIndex((c) => c.id === id)

        if (index === -1) {
            throw new CollectionNotFound(id)
        }

        collections.splice(index, 1)

        await this.save(collections)
    }
}
