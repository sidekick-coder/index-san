import Collection from '@core/entities/collection'

import { DataResponse, useCase } from './use-case'

export function useCollections(workspaceId: string) {
    function list(){
        return useCase<DataResponse<Collection[]>>('list-collections', { workspaceId })
    }
    
    function create(data?: Partial<Collection>){
        return useCase('create-collection', { workspaceId, data })
    }
    
    function destroy(collectionId: string) {
        return useCase('delete-collection', { workspaceId, collectionId })
    }

    return { list, create, destroy }
}