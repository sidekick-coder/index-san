import { createDrive } from "drive-fsa/composables/createDrive";
import type { Drive } from "./useDrive";

export function createWorkspaceDrive(handle: FileSystemDirectoryHandle): Drive {
    const fsaDrive = createDrive(handle, {
        debug: false 
    })

    const list: Drive['list'] = async (path, options) => {
        const entries = await fsaDrive.list(path, {
            recursive: !!options?.recursive
        })

        return entries.map(e => ({
            path: e.path,
            name: e.name,
            type: e.type
        }))
    }

    const get: Drive['get'] = async (path) => {
        const entry = await fsaDrive.find(path)

        if (!entry) {
            return null
        }

        return {
            path: entry.path,
            name: entry.name,
            type: entry.type
        }
    }

    const read: Drive['read'] = async (path) => {
        return fsaDrive.read(path)
    }

    const write: Drive['write'] = async (path, content) => {
        await fsaDrive.write(path, content)

        emitHook('drive:write', { path, content })
    }

    const destroy: Drive['destroy'] = async (path) => {
        await fsaDrive.destroy(path)

        emitHook('drive:destroy', { path })
    }

    const move: Drive['move'] = async (from, to) => {
        await fsaDrive.move(from, to)

        emitHook('drive:move', { from, to })
    }

    const mkdir: Drive['mkdir'] = async (path) => {
        await fsaDrive.mkdir(path)

        emitHook('drive:mkdir', { path })
    }

    return {
        list,
        get,
        read,
        write,
        destroy,
        move,
        mkdir
    }
}
