import { useCase } from './use-case'
import DirectoryEntry from '@core/entities/directory-entry'

interface ShowResponse {
    data: DirectoryEntry
}

export function useDirectoryEntry(workspaceId: string){
    function show(path: string) {
        return useCase<ShowResponse>('show-directory-entry', { 
            workspaceId,
            path
        })
    }

    return { show }
}