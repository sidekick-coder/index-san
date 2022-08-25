import DirectoryEntry from "../../entities/directory-entry"

declare namespace DeleteDirectoryEntryDTO {
    export interface Input {
        workspaceId: string
        path: string
    }
    
    // export interface Output {}
}

export default DeleteDirectoryEntryDTO