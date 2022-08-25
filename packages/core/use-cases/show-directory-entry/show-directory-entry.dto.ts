import DirectoryEntry from "../../entities/directory-entry"

declare namespace ShowDirectoryEntryDTO {
    export interface Input {
        workspaceId: string
        path: string
    }

    export interface Output {
        data: DirectoryEntry
    }
}

export default ShowDirectoryEntryDTO