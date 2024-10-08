
export interface DriveEntry {
    name: string
    path: string
    type: 'file'|'directory'
}

export interface DriveListOptions {
    recursive?: boolean
}

export interface Drive {
    get: (path: string) => Promise<DriveEntry | null>
    list: (path: string, options?: DriveListOptions) => Promise<DriveEntry[]>
    read: (path: string) => Promise<Uint8Array | null>
    write: (path: string, content: any) => Promise<void>
    destroy: (path: string) => Promise<void>
    move: (from: string, to: string) => Promise<void>
    mkdir: (path: string) => Promise<void>
}

const drive = ref<Drive>() as Ref<Drive>

export function useDrive(){

    const isLoaded = computed(() => drive.value !== undefined)

    function setDrive(newDrive: Drive){
        drive.value = newDrive
    }

    function encode(contents: string){
        return new TextEncoder().encode(contents)
    }

    function decode(contents: Uint8Array){
        return new TextDecoder().decode(contents)
    }

    function basename(path: string){
        return path.split('/').pop() as string
    }

    function dirname(path: string){
        return path.split('/').slice(0, -1).join('/')
    }

	function resolve(...args: string[]){
		const result = args
			.map(a => a.replace(/\/\//g, '/'))
			.map(a => a.split('/'))
			.flat()
			.filter(Boolean)
			.join('/')

		if (args[0].startsWith('/')) {
			return '/' + result
		}

		return result
	}

    return {
        drive,
        isLoaded,
        setDrive,
        encode,
        decode,
        basename,
        dirname,
		resolve
    }
}
