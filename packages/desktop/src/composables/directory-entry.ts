import { DataResponse, useCase } from './use-case'
import DirectoryEntry from '@core/entities/directory-entry'

export function useDirectoryEntry(workspaceId: string){
    function show(path: string) {
        return useCase<DataResponse<DirectoryEntry>>('show-directory-entry', { 
            workspaceId,
            path
        })
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
    
    function deleteEntry(path: string) {
        return useCase<DataResponse<DirectoryEntry[]>>('delete-directory-entry', { 
            workspaceId,
            path
        })
    }

    return { show, list, create, deleteEntry }
}