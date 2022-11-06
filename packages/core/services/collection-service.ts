import Collection from '../entities/collection'
import Item from '../entities/item'
import WorkspaceService from './workspace-service'

export default class CollectionService extends Collection {
    public workspace: WorkspaceService

    public get collectionCrud(){
        this.workspace.appService.managers.crud
            .useDrive(this.workspace.workspaceDrive)
            .use(this.crudName)

        return this.workspace.appService.managers.crud
    }

    private constructor(collection: Collection, workspace: WorkspaceService) {
        super(collection, collection.id)

        this.workspace = workspace
    }

    public static async from(workspace: WorkspaceService, collectionId: string) {
        
        const content = await workspace.workspaceDrive.read('.is/collections.json')

        const collections: Collection[] = []

        if (content) {
            const json = JSON.parse(content.toString())

            collections.push(...json)
        }

        const collection = collections.find(c => c.id === collectionId)

        if (!collection) throw new Error('Collection not found')


        return new CollectionService(collection, workspace)

    }

    public async list(){     
        const items = await this.collectionCrud.list(this.path)

        const data = items.map(i => ({
            ...i,
            collectionId: this.id,
            workspaceId: this.workspace.id
        }))

        return data
    }
    
    public async show(id: string){
        const item = await this.collectionCrud.findById(this.path, id)

        const data = {
            ...item,
            workspaceId: this.workspace.id,
            collectionId: this.id,
        }

        return  new Item(data, id)
    }
   
    public async create(data: Item){
        const item = new Item(data, data.id)

        await this.collectionCrud.create(this.path, item)
    }

    public async update(id: string, data: Omit<Item, 'id'>){
        await this.collectionCrud.updateById(this.path, id, data)
    }
    
    public async delete(id: string){
        await this.collectionCrud.deleteById(this.path, id)
    }

}