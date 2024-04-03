import { findBasename } from "./findBasename"
import { findDirname } from "./findDirname"
import { findHandle } from "./findHandle"

export async function writeEntry(rootHandle: FileSystemDirectoryHandle, path: string, content: Uint8Array) {

    const dirname = findDirname(path)
    const basename = findBasename(path)

    const folder = await findHandle(rootHandle, dirname)

    if (folder instanceof FileSystemDirectoryHandle === false) {
        throw new Error('Invalid path')
    }

    const handle = await folder.getFileHandle(basename, {
        create: true
    })

    if (handle instanceof FileSystemFileHandle === false) {
        throw new Error('Invalid path')
    }

    const writable = await handle.createWritable()

    await writable.write(content)

    await writable.close()
}