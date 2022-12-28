import AppConfig from '../../config/app'
import WriteDirectoryEntryDTO from './write-directory-entry.dto'

export default class WriteDirectoryEntry {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, path, data }: WriteDirectoryEntryDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        const array: any[] = Object.values(data as any)

        const result = new Uint8Array(array.length)

        array.forEach((v, i) => {
            result[i] = v
        })

        await drive.write(path, result)
    }
}
