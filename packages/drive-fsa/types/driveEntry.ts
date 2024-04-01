export interface FSADriveEntry {
    name: string
    path: string
    type: 'file' | 'directory'
    handle: FileSystemHandle
}