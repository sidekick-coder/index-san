import DirectoryEntry from '../../entities/directory-entry'

declare namespace ListDirectoryEntryDTO {
    export interface Input {
        workspaceId: string
        /**
         * path to list a subfolder
         * if empty will return to root of workspace
         * @example /sub-folder
         */
        path?: string
    }

    export interface Output {
        data: DirectoryEntry[]
    }
}

export default ListDirectoryEntryDTO
