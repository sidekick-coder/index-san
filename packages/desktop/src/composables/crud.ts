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
    
    async function destroy(itemId: string) {
        return useCase('delete-item', { workspaceId, collectionId, itemId })
    }

    return { list, create, update, destroy }
}