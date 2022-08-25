import DriveManager from "../../gateways/drive-manager";
import IWorkspaceRepository from "../../repositories/workspace-repository";
import CreateDirectoryEntryDTO from "./create-directory-entry.dto";

export default class CreateDirectoryEntry {
    
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly drive: DriveManager,
    ){}

    public async execute({ workspaceId, data }: CreateDirectoryEntryDTO.Input): Promise<CreateDirectoryEntryDTO.Output> {
        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        this.drive.use(workspace.drive).config(workspace.config)

        const exist = await this.drive.exists(data.path)

        if (exist) throw new Error('DirectoryEntry already exists')

        const entry = await this.drive.write(data)

        return {
            data: entry
        }
    }
}