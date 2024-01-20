
export interface DriveEntry {
    path: string
    type: 'file'|'directory'
}

export interface Drive {
    list: (path: string) => Promise<DriveEntry[]>
    read: (path: string) => Promise<string>
    write: (path: string, content: any) => Promise<void>
}

const drive = ref<Drive>() as Ref<Drive>

export function useDrive(){

    const isLoaded = computed(() => drive.value !== undefined)

    function setDrive(newDrive: Drive){
        drive.value = newDrive
    }

    return { drive, isLoaded, setDrive }
}