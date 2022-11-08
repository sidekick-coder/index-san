import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import UpdateDirectoryEntryDTO from './update-directory-entry.dto'

export default class UpdateDirectoryEntry {
    constructor(private readonly app: AppService){}

    public async execute({ workspaceId, path, newPath }: UpdateDirectoryEntryDTO.Input) {

        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const exists = await workspace.exists(path)

        if (!exists) throw new Error('DirectoryEntry not exists')

        await workspace.workspaceDrive.move(path, newPath)

    }
}