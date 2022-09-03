import Collection from '../entities/collection'
import DriveManager from '../gateways/drive-manager'
import IWorkspaceRepository from '../repositories/workspace-repository'

export default class ItemService {    
    public collections: Collection[] = []

    constructor(
        private readonly drive: DriveManager,
        private readonly workspaceRepository: IWorkspaceRepository,
    ){}

    public async loadWorkspace(workspaceId: string) {
        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        this.drive.use(workspace.drive).config(workspace.config)       

        const content = await this.drive.read('.index-san/collections.json')
        const collections: Collection[] = []

        if (content) {
            const json = JSON.parse(content.toString())

            collections.push(...json)
        }

        this.collections = collections
    }

    public async loadCollection(workspaceId: string, collectionId: string) {
        await this.loadWorkspace(workspaceId)

        const collection = this.collections.find(c => c.id === collectionId)

        if (!collection) throw new Error('Collection not found')

        return collection
    }
}