import { isRootPath } from "./isRootPath"

export async function findHandle(rootHandle: FileSystemDirectoryHandle, path: string) {
    if (isRootPath(path)) {
        return rootHandle
    }

    let currentHandle = rootHandle

    for (const part of path.split('/')) {
        if (part === '') {
            continue
        }

        currentHandle = await currentHandle.getDirectoryHandle(part, {
            create: false
        })
    }

    return currentHandle as FileSystemHandle
}