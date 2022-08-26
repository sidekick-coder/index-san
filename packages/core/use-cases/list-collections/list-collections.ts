import Collection from "../../entities/collection";
import DriveManager from "../../gateways/drive-manager";
import IWorkspaceRepository from "../../repositories/workspace-repository";
import ListCollectionsDTO from "./list-collections.dto";

export default class ListCollections {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly drive: DriveManager
    ){}


    public async execute({ workspaceId }: ListCollectionsDTO.Input): Promise<ListCollectionsDTO.Output> {
        
        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        this.drive.use(workspace.drive).config(workspace.config)

        const content = await this.drive.read('.index-san/collections.json')
        const collections: Collection[] = []

        if (content) {
            const json = JSON.parse(content.toString())

            collections.push(...json)
        }

        return {
            data: collections
        }
    }
}