
export interface DriveEntry {
    name: string
    path: string
    type: 'file'|'directory'
}

export interface Drive {
    get: (path: string) => Promise<DriveEntry | null>
    list: (path: string) => Promise<DriveEntry[]>
    read: (path: string) => Promise<Uint8Array | null>
    write: (path: string, content: any) => Promise<void>
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
        drive: unref(drive),
        isLoaded,
        setDrive,
        encode,
        decode
    }
}