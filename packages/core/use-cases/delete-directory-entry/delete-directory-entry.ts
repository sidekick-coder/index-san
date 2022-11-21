import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import DeleteDirectoryEntryDTO from './delete-directory-entry.dto'

export default class DeleteDirectoryEntry {
    constructor(private readonly app: AppService) {}

    public async execute({ workspaceId, path }: DeleteDirectoryEntryDTO.Input) {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const exists = await workspace.drive.exists(path)

        if (!exists) throw new Error('DirectoryEntry not exists')

        await workspace.drive.delete(path)
    }
}
