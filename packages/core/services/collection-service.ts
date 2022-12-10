import Collection from '../entities/collection'
import Item from '../entities/item'
import CollectionNotFound from '../exceptions/collection-not-found'
import ItemNotFound from '../exceptions/item-not-found'
import ArrayService from './array-service'
import ScriptService from './script-service'
import WorkspaceService from './workspace-service'

export default class CollectionService extends Collection {
    public workspace: WorkspaceService

    public scriptService = new ScriptService()

    public get crud() {
        return this.workspace.app.managers.crud.useDrive(this.workspace.drive).use(this.crudName)
    }

    private constructor(collection: Collection, workspace: WorkspaceService) {
        super(collection, collection.id)

        this.workspace = workspace
    }

    public static async from(workspace: WorkspaceService, collectionId: string) {
        const collection = workspace.collections.find((c) => c.id === collectionId)

        if (!collection) throw new CollectionNotFound(workspace.id, collectionId)

        return new CollectionService(collection, workspace)
    }

    public async list() {
        const items = await this.crud.list(this.path)

        // add workspace
        for (const item of items) {
            item.collectionId = this.id
            item.workspaceId = this.workspace.id
        }

        // add relations
        const relations = this.columns.filter((c) => c.type === 'relation')

        for await (const column of relations) {
            const relatedItems = await this.workspace.items(column.collectionId)

            items.forEach((item) => {
                const relation = relatedItems.find((r) => r.id === item[column.field])

                item[column.field] = relation || null
            })
        }

        // add script executions
        const scripts = this.columns.filter((c) => c.type === 'script')

        for await (const column of scripts) {
            for await (const item of items) {
                const { result, error } = await this.scriptService.evaluate(column.content, {
                    item,
                    workspace: this.workspace,
                })

                item[column.field] = result || error
            }
        }

        return ArrayService.from<Item>(items)
    }

    public async exists(id: string) {
        const item = await this.crud.findById(this.path, id)

        return item ? true : false
    }

    public async show(itemId: string) {
        const item = await this.crud.findById(this.path, itemId)

        if (!item) {
            throw new ItemNotFound(this.workspace.id, this.id, itemId)
        }

        const data = {
            ...item,
            workspaceId: this.workspace.id,
            collectionId: this.id,
        }

        return new Item(data, itemId)
    }

    public async create(data: Item) {
        const item = new Item(data, data.id)

        await this.crud.create(this.path, item)
    }

    public async update(id: string, data: Omit<Item, 'id'>) {
        await this.crud.updateById(this.path, id, data)
    }

    public async delete(id: string) {
        await this.crud.deleteById(this.path, id)
    }
}
