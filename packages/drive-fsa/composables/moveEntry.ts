import { destroyEntry } from "./destroyEntry"
import { findEntry } from "./findEntry"
import { listEntries } from "./listEntries"
import { makeDirectoryEntry } from "./makeDirectoryEntry"
import { readEntry } from "./readEntry"
import { writeEntry } from "./writeEntry"

export async function moveEntry(rootHandle: FileSystemDirectoryHandle, from: string, to: string){
    const entry = await findEntry(rootHandle, from)

	const toExists = await findEntry(rootHandle, to)

	if (toExists) {
		throw new Error('Target already exists')
	}

    if (!entry) {
        throw new Error('File not found')
    }


    if (entry.handle instanceof FileSystemFileHandle) {
		const contents = await readEntry(rootHandle, from)

		await writeEntry(rootHandle, to, contents)

		await destroyEntry(rootHandle, from)

		return
	}

	if (entry.handle instanceof FileSystemDirectoryHandle) {
		const entries = await listEntries(rootHandle, entry.path)

		await makeDirectoryEntry(rootHandle, to)

		for await (const e of entries) {
			const eFrom = e.path
			const eTo = e.path.replace(from, to)

			await moveEntry(rootHandle, eFrom, eTo)
		}

		await destroyEntry(rootHandle, from) 

	}

}
