import { destroyEntry } from "./destroyEntry"
import { findEntry } from "./findEntry"
import { ListEntriesOptions, listEntries } from "./listEntries"
import { makeDirectoryEntry } from "./makeDirectoryEntry"
import { moveEntry } from "./moveEntry"
import { readEntry } from "./readEntry"
import { writeEntry } from "./writeEntry"

export interface CreateDriveOptions {
    debug?: boolean
}

export function createDrive(rootHandle: FileSystemDirectoryHandle, options?: CreateDriveOptions) {

    const logger = {
        debug: options?.debug ? console.debug : () => {}
    }

    function list(path: string, options?: ListEntriesOptions){
        logger.debug('[drive-fs-api] list', path)

        return listEntries(rootHandle, path, options)
    }

    function find(path: string){
        logger.debug('[drive-fs-api] find', path)

        return findEntry(rootHandle, path)
    }

    function read(path: string){
        logger.debug('[drive-fs-api] read', path)

        return readEntry(rootHandle, path)
    }

    function write(path: string, content: Uint8Array){
        logger.debug('[drive-fs-api] write', path)

        return writeEntry(rootHandle, path, content)
    }

    function destroy(path: string){
        logger.debug('[drive-fs-api] destroy', path)

        return destroyEntry(rootHandle, path)
    }

    function move(from: string, to: string){
        logger.debug('[drive-fs-api] move', { from, to })

        return moveEntry(rootHandle, from, to)
    }

    function mkdir(path: string){
        logger.debug('[drive-fs-api] mkdir', path)

        return makeDirectoryEntry(rootHandle, path)
    }

    return {
        list,
        find,
        read,
        write,
        destroy,
        move,
        mkdir
    }
}