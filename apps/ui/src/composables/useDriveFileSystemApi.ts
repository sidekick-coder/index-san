import type { Drive, DriveEntry } from "./useDrive";

export function useDriveFileSystemApi(handle: FileSystemDirectoryHandle): Drive {

    const dirname = (path: string) => {
        const args = path
            .split('/')
            .slice(0, -1)
            .filter(Boolean)
            .join('/')

        return args === '' ? '/' : args
    }

    const basename = (path: string) => {
        return path.split('/').pop() || '/'
    }

    const getHandleByPath = async (path: string) => {
        if (path === '/') {
            return handle
        }

        let currentHandle = handle

        for (const part of path.split('/')) {
            if (part === '') {
                continue
            }

            currentHandle = await currentHandle.getDirectoryHandle(part, {
                create: false
            })
        }

        return currentHandle
    }

    const list: Drive['list'] = async (path) => {

        const result = [] as DriveEntry[]

        if (path === '/') {
            for await (const entry of handle.values()) {
                result.push({
                    name: entry.name,
                    path: entry.name,
                    type: entry.kind === 'file' ? 'file' : 'directory'
                })
            }

            return result
        }

        const folder = await getHandleByPath(path)

        if (folder.kind !== 'directory') {
            throw new Error('Not a directory')
        }

        for await (const entry of folder.values()) {
            result.push({
                name: entry.name,
                path: `${path}/${entry.name}`,
                type: entry.kind === 'file' ? 'file' : 'directory'
            })
        }

        return result
    }

    const get: Drive['get'] = async (path) => {

        if (path === '/') {
            return {
                name: '',
                path: '/',
                type: 'directory'
            }
        }
        
        const allParent = await list(dirname(path))
        
        const entry = allParent.find(e => e.path === path)

        return entry || null
    }

    const read: Drive['read'] = async (path) => {

        const folderHandle = await getHandleByPath(dirname(path))

        const fileHandle = await folderHandle.getFileHandle(basename(path), {
            create: false
        })

        const file = await fileHandle.getFile()

        const contents = await file.arrayBuffer()

        return new Uint8Array(contents)
    }

    const write: Drive['write'] = async (path, content) => {
        const folderHandle = await getHandleByPath(dirname(path))

        const fileHandle = await folderHandle.getFileHandle(basename(path), {
            create: true
        })

        const writable = await fileHandle.createWritable()

        await writable.write(content)

        await writable.close()
    }

    const destroy: Drive['destroy'] = async (path) => {
        const folderHandle = await getHandleByPath(dirname(path))

        await folderHandle.removeEntry(basename(path), {
            recursive: true
        })
    }

    const move: Drive['move'] = async (from, to) => {

        const entry = await get(from)

        if (!entry) {
            throw new Error('File not found')
        }

        if (entry.type === 'directory') {
            throw new Error('Cannot move directories')
        }

        const contents = await read(from)

        await write(to, contents)

        await destroy(entry.path)
    }

    const mkdir: Drive['mkdir'] = async (path) => {
        const folderHandle = await getHandleByPath(dirname(path))

        await folderHandle.getDirectoryHandle(basename(path), {
            create: true
        })
    }

    return { list, get, read, write, destroy, move, mkdir }
}