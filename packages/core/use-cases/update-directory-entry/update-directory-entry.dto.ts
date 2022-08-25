import DirectoryEntry from "../../entities/directory-entry"

declare namespace UpdateDirectoryEntryDTO {
    export interface Input {
        workspaceId: string
        path: string
        newPath: string
    }
    
    // export interface Output {}
}

export default UpdateDirectoryEntryDTO