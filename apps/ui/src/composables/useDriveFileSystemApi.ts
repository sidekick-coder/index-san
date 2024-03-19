import type { Drive, DriveEntry } from "./useDrive";

export function useDriveFileSystemApi(handle: FileSystemDirectoryHandle): Drive {

    const dirname = (path: string) => {
        const args = path.split('/').slice(0, -1).join('/')

        return args === '' ? '/' : args
    }

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

        for await (const entry of folder.values()) {
            result.push({
                path: entry.name,
                type: entry.kind === 'file' ? 'file' : 'directory'
            })
        }

        return result
    }

    const get: Drive['get'] = async (path) => {

        if (path === '/') {
            return {
                path: '/',
                type: 'directory'
            }
        }

        const directory = dirname(path)

        const allParent = await list(dirname(path))

        const entry = allParent.find(e => e.path === path.split('/').pop())

        return entry || null
    }

    const read: Drive['read'] = async (path) => {
        const fileHandle = await handle.getFileHandle(path, {
            create: false
        })

        const file = await fileHandle.getFile()

        const contents = await file.arrayBuffer()

        return new Uint8Array(contents)

        
    }

    const write: Drive['write'] = async (path, content) => {
        const fileHandle = await handle.getFileHandle(path, {
            create: true
        })

        const writable = await fileHandle.createWritable()

        await writable.write(content)

        await writable.close()
    }

    return { list, get, read, write }
}