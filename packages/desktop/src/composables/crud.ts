import Collection from '@core/entities/collection'
import Item from '@core/entities/item'

import { DataResponse, useCase } from './use-case'

export function useCrud(workspaceId: string, collectionId: string) {
    function list(){
        return useCase<DataResponse<Item[]>>('list-items', { workspaceId, collectionId })
    }
    
    async function create(){
        return useCase('create-item', { workspaceId, collectionId, data: {} })
    }
    
    async function update(itemId: string, data: any){
        return useCase('update-item', { workspaceId, collectionId, itemId, data })
    }
    
    function destroy(collectionId: string) {
        // return useCase('delete-collection', { workspaceId, collectionId })
    }

    return { list, create, update, destroy }
}