import { createDrive } from "drive-fsa/composables/createDrive";
import type { Drive } from "./useDrive";

export function createWorkspaceDrive(handle: FileSystemDirectoryHandle): Drive {
    const fsaDrive = createDrive(handle)

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
        return fsaDrive.write(path, content)
    }

    const destroy: Drive['destroy'] = async (path) => {
        return fsaDrive.destroy(path)
    }

    const move: Drive['move'] = async (from, to) => {
        return fsaDrive.move(from, to)
    }

    const mkdir: Drive['mkdir'] = async (path) => {
        return fsaDrive.mkdir(path)
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