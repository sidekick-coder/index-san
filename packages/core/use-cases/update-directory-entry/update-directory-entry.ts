import DriveManager from "../../gateways/drive-manager";
import IWorkspaceRepository from "../../repositories/workspace-repository";
import UpdateDirectoryEntryDTO from "./update-directory-entry.dto";

export default class UpdateDirectoryEntry {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly drive: DriveManager,
    ){}

    public async execute({ workspaceId, path, newPath }: UpdateDirectoryEntryDTO.Input) {

        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        this.drive
            .use(workspace.drive)
            .config(workspace.config)

        const exists = await this.drive.exists(path)

        if (!exists) throw new Error('DirectoryEntry not exists')

        await this.drive.update(path, newPath)

    }
}