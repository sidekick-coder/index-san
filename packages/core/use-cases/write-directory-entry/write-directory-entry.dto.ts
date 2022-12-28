export default interface WriteDirectoryEntryDTO {
    workspaceId: string
    path: string
    data: Uint8Array
}
