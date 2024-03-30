import type IDrive from "chrono/src/gateways/IDrive"

export function useChronoDrive(): IDrive {
    const { drive: _drive } = useDrive()
    
    const drive = unref(_drive)

    const resolve: IDrive['resolve'] = (...args) => {
        return args.join('/')
    }

    const findAllFiles: IDrive['findAllFiles'] = async () => {
        const entries = await drive.findAll()

        return entries
            .filter(entry => entry.type === 'file')
            .map(entry => entry.path)
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
        const entries = await drive.list(path)

        return entries.map(entry => entry.name)
    }

    const exists: IDrive['exists'] = async (path) => {
        const entry = await drive.get(path)

        return entry !== null
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
        findAllFiles,

        read,
        write,

        mkdir,
        readdir,
        
        exists,
        isFile,
        isDirectory,
    }
}