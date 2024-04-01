import { FSADriveEntry } from "../types/driveEntry"
import { findHandle } from "./findHandle"
import { isRootPath } from "./isRootPath"
import { resolvePath } from "./resolvePath"

export interface ListEntriesOptions {
    recursive: boolean
}

export async function listEntries(rootHandle: FileSystemDirectoryHandle, path: string, options?: ListEntriesOptions): Promise<FSADriveEntry[]> {
    const result = [] as FSADriveEntry[]

    const folder = isRootPath(path) ? rootHandle : await findHandle(rootHandle, path)

    if (folder instanceof FileSystemDirectoryHandle === false) {
        throw new Error('Not a directory')
    }

    for await (const handle of folder.values()) {
        result.push({
            name: handle.name,
            path: resolvePath(path, handle.name),
            type: handle.kind === 'file' ? 'file' : 'directory',
            handle: handle
        })

        if (options?.recursive && handle.kind === 'directory') {
            const subPath = resolvePath(path, handle.name)
            
            const subEntries = await listEntries(rootHandle, subPath, options)

            result.push(...subEntries)
        }
    }

    return result
}