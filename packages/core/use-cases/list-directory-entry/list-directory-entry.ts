import DriveManager from "../../gateways/drive-manager";
import IWorkspaceRepository from "../../repositories/workspace-repository";
import ListDirectoryEntryDTO from "./list-directory.dto";

export default class ListDirectoryEntry {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly drive: DriveManager<any>
    ){}

    public async execute({ workspaceId, path }: ListDirectoryEntryDTO.Input): Promise<ListDirectoryEntryDTO.Output> {

        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        const entries = await this.drive.use(workspace.drive).config(workspace.config).list(path || '/')

        return {
            data: entries
        }
    }
}