import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import UpdateCollectionsDTO from './update-collection.dto'

export default class UpdateCollection {
    constructor(private readonly app: AppService){}

    public collectionsFilename = '.is/collections.json'

    public async execute({ workspaceId, collectionId, data }: UpdateCollectionsDTO.Input){
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const index = workspace.collections.findIndex(c => c.id === collectionId)

        if (index === -1) throw new Error('Collection not found')

        workspace.collections[index] = Object.assign(workspace.collections[index], data)

        await workspace.save()
    }
}