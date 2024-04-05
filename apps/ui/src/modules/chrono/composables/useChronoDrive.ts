import type IDrive from "chrono/src/gateways/IDrive"
import { isRootPath } from "drive-fsa/composables/isRootPath"

export function useChronoDrive(): IDrive {
    const { drive: _drive } = useDrive()
    
    const drive = unref(_drive)

    const resolve: IDrive['resolve'] = (...args) => {
        return args.join('/')
    }

    const read: IDrive['read'] = (path) => {
        return drive.read(path)
    }
    
    const write: IDrive['write'] = (path, contents) => {
        return drive.write(path, contents)
    }
    
    const mkdir: IDrive['mkdir'] = (path) => {
        return drive.mkdir(path)
    }
    
    const readdir: IDrive['readdir'] = async (path, options) => {
        const entries = await drive.list(path, {
            recursive: options?.recursive,
        })

        if (options?.onlyFiles) {
            return entries.filter(entry => entry.type === 'file').map(entry => entry.path)
        }

        if (options?.onlyDirectories){
            return entries.filter(entry => entry.type === 'directory').map(entry => entry.path)
        }

        return entries.map(entry => entry.name)
    }

    const exists: IDrive['exists'] = async (path) => {
        const parent = dirname(path)

        if (isRootPath(path)) {
            return true
        }

        if (!await exists(parent)) {
            return false
        }

        const parentEnries = await drive.list(parent)

        const entry = parentEnries.find(entry => entry.name === basename(path))

        return !!entry
    }

    const isFile: IDrive['isFile'] = async (path) => {
        const entry = await drive.get(path)

        return entry?.type === 'file'
    }

    const isDirectory: IDrive['isDirectory'] = async (path) => {
        const entry = await drive.get(path)

        return entry?.type === 'directory'
    }

    

    return {
        resolve,

        read,
        write,

        mkdir,
        readdir,
        
        exists,
        isFile,
        isDirectory,
    }
}