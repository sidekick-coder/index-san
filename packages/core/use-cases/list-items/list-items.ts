import Collection from "../../entities/collection";
import DirectoryEntry from "../../entities/directory-entry";
import CrudManager from "../../gateways/crud-manager";
import DriveManager from "../../gateways/drive-manager";
import IWorkspaceRepository from "../../repositories/workspace-repository";
import ListItemsDTO from "./list-items.dto";

export default class ListItems {
    constructor(
        private readonly drive: DriveManager,
        private readonly crud: CrudManager,

        private readonly workspaceRepository: IWorkspaceRepository,
    ){}
    public async execute({ workspaceId, collectionId  }:ListItemsDTO.Input): Promise<ListItemsDTO.Output> {
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

        this.crud.use(collection.crudName).useDrive(this.drive)

        const entry = new DirectoryEntry({
            name: collection.path,
            type: 'directory',
            path: collection.path
        })

        const items = await this.crud.list(entry)

        const data = items.map(i => ({
            ...i,
            collectionId: collection.id,
            workspaceId: workspace.id
        }))

        return {
            data: data
        }
    }
}