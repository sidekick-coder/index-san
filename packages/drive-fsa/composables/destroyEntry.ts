import { findBasename } from "./findBasename"
import { findDirname } from "./findDirname"
import { findHandle } from "./findHandle"

export async function destroyEntry(rootHandle: FileSystemDirectoryHandle, path: string) {

    const dirname = findDirname(path)
    const basename = findBasename(path)

    const folder = await findHandle(rootHandle, dirname)

    if (folder instanceof FileSystemDirectoryHandle === false) {
        throw new Error('Invalid path')
    }

    await folder.removeEntry(basename, {
        recursive: true
    })
}