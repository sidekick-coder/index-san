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

    const isRootPath = (path: string) => {
        return ['/', '', '.'].includes(path)
    }

    const basename = (path: string) => {
        return path.split('/').pop() || '/'
    }

    const getHandleByPath = async (path: string) => {
        if (isRootPath(path)) {
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

    const findAll: Drive['findAll'] = async (path = '/') => {
        const entries = await list(path)

        for await (const entry of entries) {
            if (entry.type === 'directory') {
                entries.push(...await findAll(entry.path))
            }
        }

        return entries.filter((e, i, a) => a.findIndex(e2 => e2.path === e.path) === i)
    }

    const list: Drive['list'] = async (path) => {
        console.debug('[drive-fs-api] list', path)

        const entry = await get(path)

        if (!entry) {
            throw new Error('Not found')
        }

        const result = [] as DriveEntry[]

        if (isRootPath(path)) {
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
        console.debug('[drive-fs-api] get', path)

        if (isRootPath(path)) {
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
        console.debug('[drive-fs-api] read', path)

        const entry = await get(path)

        if (!entry) {
            return null
        }
        
        const folderHandle = await getHandleByPath(dirname(path))        
        
        const fileHandle = await folderHandle.getFileHandle(basename(path), {
            create: false
        })

        const file = await fileHandle.getFile()

        const contents = await file.arrayBuffer()

        return new Uint8Array(contents)
    }

    const write: Drive['write'] = async (path, content) => {
        console.debug('[drive-fs-api] write', path)

        const folderHandle = await getHandleByPath(dirname(path))

        const fileHandle = await folderHandle.getFileHandle(basename(path), {
            create: true
        })

        const writable = await fileHandle.createWritable()

        await writable.write(content)

        await writable.close()
    }

    const destroy: Drive['destroy'] = async (path) => {
        console.debug('[drive-fs-api] destroy', path)

        const folderHandle = await getHandleByPath(dirname(path))

        await folderHandle.removeEntry(basename(path), {
            recursive: true
        })
    }

    const move: Drive['move'] = async (from, to) => {
        console.debug('[drive-fs-api] move', { from, to })

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
        console.debug('[drive-fs-api] mkdir', path)

        const folderHandle = await getHandleByPath(dirname(path))

        await folderHandle.getDirectoryHandle(basename(path), {
            create: true
        })
    }

    return {
        findAll,
        list,
        get,
        read,
        write,
        destroy,
        move,
        mkdir
    }
}