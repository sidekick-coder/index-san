import Collection from '../entities/collection'
import Workspace from '../entities/workspace'
import AppService from './app-service'
import CollectionService from './collection-service'

export default class WorkspaceService extends Workspace {
    
    public appService: AppService
    public collections: Collection[]

    public get workspaceDrive(){
        this.appService.managers.drive.use(this.drive).config(this.config)

        return this.appService.managers.drive
    }

    private constructor(workspace: Workspace, appService: AppService) {
        super(workspace, workspace.id)

        this.appService = appService
    }

    public static async from(service: AppService, id: string){
        const data = await service.repositories.workspace.findById.bind(service.repositories.workspace)(id)

        if (!data) {
            throw new Error('Workspace not found')
        }

        const workspace = new WorkspaceService(data, service)
        
        const content = await workspace.workspaceDrive.read('.is/collections.json')

        const collections: Collection[] = []

        if (content) {
            const json = JSON.parse(content.toString())

            collections.push(...json)
        }

        workspace.collections = collections

        return workspace
    }

    public list(path: string) {
        const entries = this.workspaceDrive.list(path)

        return entries
    }
    
    public async get(path: string) {
        return this.workspaceDrive.get(path)
    }

    public async read(path: string) {
        return this.workspaceDrive.read(path)
    }
    
    public async write(path: string, content: String | Buffer) {
        if (typeof content === 'string') {
            content = Buffer.from(content)
        }

        await this.workspaceDrive.write(path, content as Buffer)
    }

    public toObject(){
        return {
            id: this.id,
            name: this.name,
            path: this.path,
            drive: this.drive,
            config: this.config
        }
    }

    public async save(){
        const payload = this.toObject()

        this.appService.repositories.workspace.updateById(this.id, payload)

        await this.appService.managers.drive
            .write('.is/collections.json', JSON.stringify(this.collections))
    }

    public collection(collectionId: string) {
        return CollectionService.from(this, collectionId)
    }

    public async createCollection(data: Collection) {
        this.collections.push(data)

        await this.save()

        return this.collection(data.id)
    }
    
}