export interface DriveEntry {
	name: string
	path: string
	type: 'file' | 'directory'
}

export interface CommonOptions {
    recursive?: boolean
}

export interface WorkspaceDrive {
	get: (path: string) => Promise<DriveEntry | null>
	list: (path: string, options?: CommonOptions) => Promise<DriveEntry[]>
	read: (path: string) => Promise<Uint8Array | null>
	write: (path: string, content: any, options?: CommonOptions) => Promise<void>
	destroy: (path: string) => Promise<void>
	move: (from: string, to: string) => Promise<void>
	mkdir: (path: string, options?: CommonOptions) => Promise<void>
}

const drive = ref<WorkspaceDrive>()

export function provideWorkspaceDrive(payload: WorkspaceDrive) {
	drive.value = payload
}

export function useWorkspaceDrive() {
	const result = unref(drive) 

	if (!result) {
		throw new Error('Error loading workspace drive')
	}

	return result
}
