import { destroyEntry } from "./destroyEntry"
import { findEntry } from "./findEntry"
import { readEntry } from "./readEntry"
import { writeEntry } from "./writeEntry"

export async function moveEntry(rootHandle: FileSystemDirectoryHandle, from: string, to: string){
    const entry = await findEntry(rootHandle, from)

    if (!entry) {
        throw new Error('File not found')
    }

    if (entry instanceof FileSystemFileHandle) {

        const contents = await readEntry(rootHandle, from)
    
        await writeEntry(rootHandle, to, contents)
    
        await destroyEntry(rootHandle, from)

        return
    }

    if (entry instanceof FileSystemDirectoryHandle) {
        throw new Error('Not implemented yet')
    }

}