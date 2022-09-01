import Collection from '../../entities/collection'
import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import DeleteCollectionsDTO from './delete-collection.dto'

export default class DeleteCollection {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly drive: DriveManager
    ){}

    public collectionsFilename = '.index-san/collections.json'

    public async execute({ workspaceId, collectionId }: DeleteCollectionsDTO.Input) {
        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        this.drive.use(workspace.drive).config(workspace.config)

        const content = await this.drive.read(this.collectionsFilename)

        const collections: Collection[] = !content ? [] : JSON.parse(content.toString())

        const index = collections.findIndex(c => c.id === collectionId)

        if (index === -1) throw new Error('Collection not found')

        collections.splice(index, 1)

        await this.drive.update(
            this.collectionsFilename,
            this.collectionsFilename,
            Buffer.from(JSON.stringify(collections))
        )
    }
}