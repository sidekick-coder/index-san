import BaseException from '../../exceptions/base'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import WriteDirectoryEntryDTO from './write-directory-entry.dto'

export default class WriteDirectoryEntry {
    constructor(private readonly app: AppService) {}

    public async execute({ workspaceId, path, data, contentType }: WriteDirectoryEntryDTO.Input) {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        contentType = contentType || 'string'

        if (contentType === 'string' && typeof data !== 'string') {
            throw new BaseException('Invalid content type')
        }

        if (contentType === 'string') {
            return await workspace.drive.write(path, Buffer.from(data))
        }

        const array: any[] = Object.values(data as any)

        const result = new Uint8Array(array.length)

        array.forEach((v, i) => {
            result[i] = v
        })

        const buffer = Buffer.from(result)

        await workspace.drive.write(path, buffer)
    }
}
