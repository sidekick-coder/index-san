import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import WriteDirectoryEntryDTO from './write-directory-entry.dto'

export default class WriteDirectoryEntry {
    constructor(private readonly app: AppService){}

    public async execute({ workspaceId, path, data }: WriteDirectoryEntryDTO.Input) {

        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const exists = await workspace.drive.exists(path)

        if (!exists) throw new Error('DirectoryEntry not found')

        if (typeof data === 'string') {
            data = Buffer.from(data)
        }

        await workspace.drive.write(path, data)

    }
}