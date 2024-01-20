import type { Drive, DriveEntry } from "./useDrive";

export function useDriveFileSystemApi(handle: FileSystemDirectoryHandle): Drive {

    const list: Drive['list'] = async (path) => {

        const result = [] as DriveEntry[]

        if (path === '/') {
            for await (const entry of handle.values()) {
                result.push({
                    path: entry.name,
                    type: entry.kind === 'file' ? 'file' : 'directory'
                })
              }

            return result
        }

        const folder = await handle.getDirectoryHandle(path, {
            create: false        
        })

        if (folder.kind !== 'directory') {
            throw new Error('Not a directory')
        }

        const entries = await folder.values()

        return entries.map(entry => ({
            path: entry.name,
            type: entry.kind === 'file' ? 'file' : 'directory'
        }))
    }

    const read: Drive['read'] = async (path) => {
        throw new Error('Not implemented')
    }

    const write: Drive['write'] = async (path, content) => {
        throw new Error('Not implemented')
    }

    return { list, read, write }
}