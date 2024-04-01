import { findHandle } from "./findHandle"

export async function readEntry(rootHandle: FileSystemDirectoryHandle, path: string) {
    const handle = await findHandle(rootHandle, path)

    if (!handle) {
        throw new Error('Not found')
    }

    if (handle instanceof FileSystemFileHandle === false) {
        throw new Error('Not a file')
    }

    const file = await handle.getFile()

    const contents = await file.arrayBuffer()

    return new Uint8Array(contents)
}