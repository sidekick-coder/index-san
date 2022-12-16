declare namespace WriteDirectoryEntryDTO {
    export interface Input {
        workspaceId: string
        path: string
        contentType?: 'string' | 'Uint8Array'
        data: any
    }
}

export default WriteDirectoryEntryDTO
