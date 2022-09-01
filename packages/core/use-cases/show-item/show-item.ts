import Collection from "../../entities/collection";
import DirectoryEntry from "../../entities/directory-entry";
import Item from "../../entities/item";
import CrudManager from "../../gateways/crud-manager";
import DriveManager from "../../gateways/drive-manager";
import IWorkspaceRepository from "../../repositories/workspace-repository";
import ShowItemDTO from "./show-item.dto";

export default class ShowItem {
    constructor(
        private readonly drive: DriveManager,
        private readonly crud: CrudManager,
        private readonly workspaceRepository: IWorkspaceRepository,
    ){}

    public async execute({ workspaceId, collectionId, itemId }:ShowItemDTO.Input): Promise<ShowItemDTO.Output> {
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

        const item = await this.crud.findById(collection.path, itemId)

        if (!item) throw new Error('Item not found')

        const data = {
            ...item,
            collectionId,
            workspaceId,
        }

        return {
            data
        }
    }
}