import Item from '@core/entities/item'
import { useHooks } from '@/plugins/hooks'
import { createCollectionKey, useCollectionItems } from './collection'
import { DataResponse, useCase } from './use-case'

export interface CollectionFolderItem extends Item {
    _filename: string
    _content?: Record<string, any>
}

const hooks = useHooks()

export function useItemRepository(workspaceId: string, collectionId: string) {
    async function show(itemId: string) {
        const { data } = await useCase<DataResponse<CollectionFolderItem>>('show-item', {
            workspaceId,
            collectionId,
            itemId,
        })

        return data
    }

    async function list() {
        return useCase<DataResponse<CollectionFolderItem[]>>('list-items', {
            workspaceId,
            collectionId,
        })
    }

    async function create(data: any = {}) {
        hooks.emit(createCollectionKey(workspaceId, collectionId, 'update'))

        return useCase('create-item', { workspaceId, collectionId, data })
    }

    async function update(itemId: string, data: any) {
        hooks.emit(createCollectionKey(workspaceId, collectionId, 'update'))

        return useCase('update-item', { workspaceId, collectionId, itemId, data })
    }

    async function destroy(itemId: string) {
        hooks.emit(createCollectionKey(workspaceId, collectionId, 'update'))

        return useCase('delete-item', { workspaceId, collectionId, itemId })
    }

    return { list, show, create, update, destroy }
}

export async function createItem(workspaceId: string, collectionId: string, data: any = {}) {
    const [, setItems] = useCollectionItems()

    const result = await useCase('create-item', { workspaceId, collectionId, data })

    await setItems(workspaceId, collectionId, true)

    return result
}

export async function deleteItem(workspaceId: string, collectionId: string, itemId: string) {
    const [, setItems] = useCollectionItems()

    const result = await useCase('delete-item', { workspaceId, collectionId, itemId })

    await setItems(workspaceId, collectionId, true)

    return result
}

export async function updateItem(
    workspaceId: string,
    collectionId: string,
    itemId: string,
    data: any = {}
) {
    const [, setItems] = useCollectionItems()

    const result = await useCase('update-item', { workspaceId, collectionId, itemId, data })

    await setItems(workspaceId, collectionId, true)

    return result
}
