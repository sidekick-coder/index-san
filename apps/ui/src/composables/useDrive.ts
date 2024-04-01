
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

    return {
        drive,
        isLoaded,
        setDrive,
        encode,
        decode
    }
}