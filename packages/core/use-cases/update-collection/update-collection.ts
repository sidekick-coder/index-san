import Collection from '../../entities/collection'
import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import UpdateCollectionsDTO from './update-collection.dto'

export default class UpdateCollection {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly drive: DriveManager
    ){}

    public collectionsFilename = '.is/collections.json'

    public async execute({ workspaceId, collectionId, data }: UpdateCollectionsDTO.Input){
        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        this.drive.use(workspace.drive).config(workspace.config)

        const content = await this.drive.read(this.collectionsFilename)

        const collections: Collection[] = !content ? [] : JSON.parse(content.toString())

        const collection = collections.find(c => c.id === collectionId)

        if (!collection) throw new Error('Collection not found')

        Object.assign(collection, data)

        await this.drive.write(
            this.collectionsFilename,
            Buffer.from(JSON.stringify(collections, null, 4))
        )
    }
}