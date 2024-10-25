import { findDirname } from "./findDirname"
import { isRootPath } from "./isRootPath"

async function findChildEntries(handle: FileSystemDirectoryHandle) {
	const handles = [] as FileSystemHandle[]

	for await (const h of handle.values()) {
		handles.push(h)
	}

	return handles
}

export async function findHandle(rootHandle: FileSystemDirectoryHandle, path: string) {
	try {
		if (isRootPath(path)) {
			return rootHandle
		}

		let currentHandle = rootHandle

		for await (const part of path.split('/')) {
			if (part === '') {
				continue
			}

			const children = await findChildEntries(currentHandle)

			const child = children.find(c => c.name === part)

			if (child instanceof FileSystemFileHandle) {
				return child
			}

			currentHandle = await currentHandle.getDirectoryHandle(part, {
				create: false
			})
		}

		return currentHandle as FileSystemHandle

	} catch (error) {
		console.error(`Error on finding handle: ${path}\n`, error)
		return null
	}
}

