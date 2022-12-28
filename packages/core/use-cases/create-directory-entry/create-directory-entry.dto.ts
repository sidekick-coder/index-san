import DirectoryEntry from '../../entities/directory-entry'

export default interface CreateDirectoryEntryDTO {
    workspaceId: string
    data: DirectoryEntry
}
