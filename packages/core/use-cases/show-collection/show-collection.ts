import Collection from '../../entities/collection'
import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import ShowCollectionsDTO from './show-collection.dto'

export default class ShowCollection {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly drive: DriveManager
    ) {}

    public async execute({ workspaceId, collectionId }: ShowCollectionsDTO.Input): Promise<ShowCollectionsDTO.Output>{
        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        this.drive.use(workspace.drive).config(workspace.config)

        const content = await this.drive.read('.index-san/collections.json')
        const collections: Collection[] = []

        if (content) {
            const json = JSON.parse(content.toString())

            collections.push(...json)
        }

        const collection = collections.find(c => c.id === collectionId)

        if (!collection) throw new Error('Collection not found')

        return {
            data: collection
        }

    }
}