import { DataResponse, useCase } from './use-case'
import DirectoryEntry from '@core/entities/directory-entry'

export function useDirectoryEntry(workspaceId: string){
    async function show(path: string) {
        const { data } = await  useCase<DataResponse<DirectoryEntry>>('show-directory-entry', { 
            workspaceId,
            path
        })

        return data
    }
   
    function list(path: string) {
        return useCase<DataResponse<DirectoryEntry[]>>('list-directory-entry', { 
            workspaceId,
            path
        })
    }

    function create(entry: Partial<DirectoryEntry>) {
        return useCase<DataResponse<DirectoryEntry[]>>('create-directory-entry', { 
            workspaceId,
            data: entry
        })
    }
    
    function read(path: string) {
        return useCase<Uint8Array>('read-directory-entry', { 
            workspaceId,
            path
        })
    }
    
    function write(path: string, data: any) {
        return useCase<void>('write-directory-entry', { 
            workspaceId,
            path,
            data
        })
    }
    
    function deleteEntry(path: string) {
        return useCase<DataResponse<DirectoryEntry[]>>('delete-directory-entry', { 
            workspaceId,
            path
        })
    }

    return { show, list, read, create, write, deleteEntry }
}