import { findHandle } from "./findHandle"

interface Options {
    responseType: 'arraybuffer' | 'text' | 'json'
}

export async function readEntry(rootHandle: FileSystemDirectoryHandle, path: string, options?: Options) {
    const handle = await findHandle(rootHandle, path)

    if (!handle) {
        throw new Error('Not found')
    }

    if (handle instanceof FileSystemFileHandle === false) {
        throw new Error('Not a file')
    }

    const file = await handle.getFile()

    const contents = await file.arrayBuffer()

    const buffer = new Uint8Array(contents)

    if (options?.responseType === 'text') {
        return new TextDecoder().decode(buffer)
    }

    if (options?.responseType === 'json') {
        return JSON.parse(new TextDecoder().decode(buffer))
    }

    return buffer 
}
