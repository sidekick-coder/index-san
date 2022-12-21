import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import ReadDirectoryEntryDTO from './read-directory-entry.dto'

export default class ReadDirectoryEntry {
    constructor(private readonly app: AppService) {}

    public async execute({
        workspaceId,
        path,
    }: ReadDirectoryEntryDTO.Input): Promise<Buffer | null> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const content = await workspace.drive.read(path)

        return content
    }
}
