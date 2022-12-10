import Collection from '../entities/collection'
import Workspace from '../entities/workspace'
import WorkspaceNotFound from '../exceptions/workspace-not-found'
import AppService from './app-service'
import CollectionService from './collection-service'

export default class WorkspaceService extends Workspace {
    public app: AppService
    public collections: Collection[]

    public get drive() {
        return this.app.managers.drive.use(this.driveName).config(this.config)
    }

    private constructor(workspace: Workspace, appService: AppService) {
        super(workspace, workspace.id)

        this.app = appService
    }

    public static async from(service: AppService, id: string) {
        const data = await service.repositories.workspace.findById.bind(
            service.repositories.workspace
        )(id)

        if (!data) {
            throw new WorkspaceNotFound(id)
        }

        const workspace = new WorkspaceService(data, service)

        const content = await workspace.drive.read('.is/collections.json')

        const collections: Collection[] = []

        if (content) {
            const json = JSON.parse(content.toString())

            collections.push(...json)
        }

        workspace.collections = collections

        return workspace
    }

    public toObject() {
        return {
            id: this.id,
            name: this.name,
            driveName: this.driveName,
            config: this.config,
        }
    }

    public async save() {
        const payload = this.toObject()

        this.app.repositories.workspace.updateById(this.id, payload)

        await this.drive.write('.is/collections.json', JSON.stringify(this.collections, null, 4))
    }

    public collection(collectionId: string) {
        return CollectionService.from(this, collectionId)
    }

    public async items(collectionId: string) {
        const collection = await this.collection(collectionId)

        return collection.list()
    }

    public async createCollection(data: Collection) {
        this.collections.push(data)

        await this.save()

        return this.collection(data.id)
    }
}
