import DirectoryEntry from '../../entities/directory-entry'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import CreateDirectoryEntryDTO from './create-directory-entry.dto'

export default class CreateDirectoryEntry {    
    constructor(private readonly app: AppService){}

    public async execute({ workspaceId, data }: CreateDirectoryEntryDTO.Input): Promise<CreateDirectoryEntryDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const exist = await workspace.exists(data.path)

        if (exist) throw new Error('DirectoryEntry already exists')

        
        const entry = new DirectoryEntry(data)

        if (data.type === 'directory') {
            await workspace.workspaceDrive.mkdir(data.path)
        }

        if (data.type === 'file') {
            await workspace.workspaceDrive.write(data.path, Buffer.from(''))
        }


        return { data: entry }
    }
}