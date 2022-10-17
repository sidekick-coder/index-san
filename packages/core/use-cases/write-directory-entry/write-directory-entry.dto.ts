declare namespace WriteDirectoryEntryDTO {
    export interface Input {
        workspaceId: string
        path: string
        data: Buffer | string
    }
}

export default WriteDirectoryEntryDTO