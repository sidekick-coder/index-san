import DirectoryEntry from '../../entities/directory-entry'
export default interface Drive {
    config: Record<string, any>
    exists: (entryPath: string) => Promise<boolean>
    list: (entryPath: string) => Promise<DirectoryEntry[]>
    get: (entryPath: string) => Promise<DirectoryEntry | null>
    mkdir: (entryPath: string) => Promise<DirectoryEntry>

    move: (source: string, target: string) => Promise<void>
    read: (entryPath: string) => Promise<Uint8Array | null>
    write: (entryPath: string, bytes: Uint8Array) => Promise<void>

    delete(entryPath: string): Promise<void>
}
