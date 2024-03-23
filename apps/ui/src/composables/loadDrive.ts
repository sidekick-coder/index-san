import { get, set } from 'idb-keyval'

export async function loadLastDrive(){
    const lastHandle = await get<FileSystemDirectoryHandle>('last-handle')

    if (!lastHandle) return

    const isAllowed = await lastHandle.queryPermission({ mode: 'readwrite' })  === 'granted'

    if(isAllowed){
        loadDrive(lastHandle)
    }
}

export function loadDrive(handle: FileSystemDirectoryHandle){
    const { setDrive } = useDrive()

    const workspaceDrive = useDriveFileSystemApi(handle)

    setDrive(workspaceDrive)

    set('last-handle', handle)
}