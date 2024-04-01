import { findBasename } from "./findBasename"
import { findDirname } from "./findDirname"
import { findHandle } from "./findHandle"

export async function makeDirectoryEntry(rootHandle: FileSystemDirectoryHandle, path: string) {
    const dirname = findDirname(path)
    const basename = findBasename(path)

    const folder = await findHandle(rootHandle, dirname)

    if (folder instanceof FileSystemDirectoryHandle === false) {
        throw new Error('Invalid path')
    }

    await folder.getDirectoryHandle(basename, {
        create: true
    })    
}