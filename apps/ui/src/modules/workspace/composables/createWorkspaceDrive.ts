import { createDrive } from "drive-fsa/composables/createDrive";
import type { WorkspaceDrive } from "./useWorkspaceDrive";

export function createWorkspaceDrive(handle: FileSystemDirectoryHandle) {
    const fsaDrive = createDrive(handle, {
        debug: false 
    })

    const list: WorkspaceDrive['list'] = async (path, options) => {
        const entries = await fsaDrive.list(path, {
            recursive: !!options?.recursive
        })

        return entries.map(e => ({
            path: e.path,
            name: e.name,
            type: e.type
        }))
    }

    const get: WorkspaceDrive['get'] = async (path) => {
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

    const read: WorkspaceDrive['read'] = async (path) => {
        return fsaDrive.read(path)
    }

    const write: WorkspaceDrive['write'] = async (path, content, options) => {

        if (options?.recursive && !(await get(dirname(path)))) {
            await mkdir(dirname(path), { recursive: true })
        }

        await fsaDrive.write(path, content)

        emitHook('drive:write', { path, content })
    }

    const destroy: WorkspaceDrive['destroy'] = async (path) => {
        await fsaDrive.destroy(path)

        emitHook('drive:destroy', { path })
    }

    const move: WorkspaceDrive['move'] = async (from, to) => {
        await fsaDrive.move(from, to)

        emitHook('drive:move', { from, to })
    }

    const mkdir: WorkspaceDrive['mkdir'] = async (path, options) => {
        if (options?.recursive && !(await get(dirname(path)))) {
            await mkdir(dirname(path), { recursive: true })
        }

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
