import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import ShowDirectoryEntryDTO from './show-directory-entry.dto'

export default class ShowDirectoryEntry {
    constructor(private readonly app: AppService){}

    public async execute({ workspaceId, path }: ShowDirectoryEntryDTO.Input): Promise<ShowDirectoryEntryDTO.Output> {

        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const entry = await workspace.get(path)

        if (!entry) throw new Error('DirectoryEntry not found')

        return {
            data: entry
        }

    }
}