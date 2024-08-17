import { FSADriveEntry } from "../types/driveEntry"
import { findDirname } from "./findDirname"
import { isRootPath } from "./isRootPath"
import { listEntries } from "./listEntries"

export async function findEntry(rootHandle: FileSystemDirectoryHandle, path: string): Promise<FSADriveEntry | null> {
	try {
		if (isRootPath(path)) {
			return {
				name: '',
				path: '/',
				type: 'directory',
				handle: rootHandle
			}
		}

		const dirname = findDirname(path)

		const allParentEntries = await listEntries(rootHandle, dirname)

		const entry = allParentEntries.find(e => e.path === path)

		return entry || null

	} catch (error) {
		return null
	}
}
