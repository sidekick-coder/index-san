import Collection from '../entities/collection'
import Item from '../entities/item'
import WorkspaceService from './workspace-service'

export default class CollectionService extends Collection {
    public workspace: WorkspaceService

    public get crud(){
        return this.workspace.app.managers.crud
            .useDrive(this.workspace.drive)
            .use(this.crudName)
    }

    private constructor(collection: Collection, workspace: WorkspaceService) {
        super(collection, collection.id)

        this.workspace = workspace
    }

    public static async from(workspace: WorkspaceService, collectionId: string) {

        const collection = workspace.collections.find(c => c.id === collectionId)

        if (!collection) throw new Error('Collection not found')

        return new CollectionService(collection, workspace)

    }

    public async list(){     
        const items = await this.crud.list(this.path)

        const data = items.map(i => ({
            ...i,
            collectionId: this.id,
            workspaceId: this.workspace.id
        }))

        return data
    }
    
    public async show(id: string){
        const item = await this.crud.findById(this.path, id)

        if (!item) {
            throw new Error('Item not found')
        }

        const data = {
            ...item,
            workspaceId: this.workspace.id,
            collectionId: this.id,
        }

        return  new Item(data, id)
    }
   
    public async create(data: Item){
        const item = new Item(data, data.id)

        await this.crud.create(this.path, item)
    }

    public async update(id: string, data: Omit<Item, 'id'>){
        await this.crud.updateById(this.path, id, data)
    }
    
    public async delete(id: string){
        await this.crud.deleteById(this.path, id)
    }

}