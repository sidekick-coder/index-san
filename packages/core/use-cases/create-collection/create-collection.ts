import Collection from '../../entities/collection'
import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import CreateCollectionDTO from './create-collection.dto'

export default class CreateCollection {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly drive: DriveManager
    ){}

    public collectionsFilename = '.is/collections.json'


    public async execute({ workspaceId, data }: CreateCollectionDTO.Input): Promise<CreateCollectionDTO.Output> {
        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        this.drive.use(workspace.drive).config(workspace.config)

        const collection = new Collection(data)

        const collections = [collection]
        
        let content = await this.drive.read(this.collectionsFilename)

        if (!content) {
            await this.drive.write(this.collectionsFilename, Buffer.from(JSON.stringify([])))

            content = Buffer.from(JSON.stringify([]))
        }

        const json = JSON.parse(content.toString())

        collections.push(...json)

        await this.drive.mkdir(data.path)

        await this.drive.write(
            this.collectionsFilename,
            Buffer.from(JSON.stringify(collections))
        )


        return {
            data: collection
        }
    }
}