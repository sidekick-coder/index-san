import DirectoryEntry from '../../entities/directory-entry'

declare namespace CreateDirectoryEntryDTO {
    export interface Input {
        workspaceId: string
        data: DirectoryEntry
    }

    export interface Output {
        data: DirectoryEntry
    }
}

export default CreateDirectoryEntryDTO
