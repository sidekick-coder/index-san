import Item from '@core/entities/item'
import { useHooks } from '../plugins/hooks'
import { createCollectionKey } from './collection'
import { DataResponse, useCase } from './use-case'

export interface CollectionFolderItem extends Item {
    _filename: string
    _content?: Record<string, any>
}

export function useItemRepository(workspaceId: string, collectionId: string) {
    const hooks = useHooks()    

    async function show(itemId: string){
        const { data } = await useCase<DataResponse<CollectionFolderItem>>('show-item', { workspaceId, collectionId, itemId })

        return data
    }

    async function list(){
        return useCase<DataResponse<CollectionFolderItem[]>>('list-items', { workspaceId, collectionId })
    }
    
    async function create(data: any = {}){
        hooks.emit(createCollectionKey(workspaceId, collectionId, 'update'))

        return useCase('create-item', { workspaceId, collectionId, data })
    } 
    
    async function update(itemId: string, data: any){
        hooks.emit(createCollectionKey(workspaceId, collectionId, 'update'))

        return useCase('update-item', { workspaceId, collectionId, itemId, data })
    }
    
    async function destroy(itemId: string) {
        hooks.emit(createCollectionKey(workspaceId, collectionId, 'update'))

        return useCase('delete-item', { workspaceId, collectionId, itemId })
    }

    return { list, show, create, update, destroy }
}