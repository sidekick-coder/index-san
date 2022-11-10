import uuid from 'uuid-random'
import { ref } from 'vue'

import Collection, { CollectionColumn } from '@core/entities/collection'
import { DataResponse, useCase } from './use-case'
import { useHooks, HookEventListener } from '../plugins/hooks'
import { useState } from './state'
import { CollectionFolderItem } from './item'

const hooks = useHooks()

export function createCollectionKey(workspaceId: string, collectionId: string, ...args: string[]){
    return ['workspaces', workspaceId,'collections', collectionId, ...args].join(':')
}

export function useCollectionRepository(workspaceId: string) {
    function show(collectionId: string){
        return useCase<DataResponse<Collection>>('show-collection', { workspaceId, collectionId })
    }

    function list(){
        return useCase<DataResponse<Collection[]>>('list-collections', { workspaceId })
    }
    
    function create(data?: Partial<Collection>){
        return useCase('create-collection', { workspaceId, data })
    }
    
    function update(collectionId: string, data?: Partial<Collection>){
        return useCase('update-collection', { workspaceId, collectionId, data })
    }
    
    function destroy(collectionId: string) {
        return useCase('delete-collection', { workspaceId, collectionId })
    }

    return { list, show, create, update, destroy }
}

export function useCollection(workspaceId: string, collectionId: string) {
    const hooks = useHooks()
    const repository = useCollectionRepository(workspaceId)

    async function show(){
        const { data } = await repository.show(collectionId)

        return data
    }

    async function update(payload: Partial<Collection>){
        await repository.update(collectionId, payload)

        hooks.emit(createCollectionKey(workspaceId, collectionId, 'update'))
    }

    async function addColumn(payload?: Partial<CollectionColumn>) {
        const id = uuid()

        const data = {
            id: uuid(),
            label: 'New',
            field: id,
            type: 'text',
            ...payload,
        }
    
        const collection = await show()
    
        const columns = collection.columns.slice() || []
    
        columns.push(data)

        await update({ columns })    
    }

    async function updateColumn(id: string, payload: Omit<CollectionColumn, 'id' | 'field'>) {
        const collection = await show()

        const columns = collection.columns?.slice() || []

        const column = columns.find(c => c.id === id)

        if (!column) return

        Object.keys(payload)
            .filter(k => !['id'].includes(k))
            .forEach(key => {
                column[key] = payload[key]
            })        

        await update({ columns })
    }

    async function deleteColumn(id: string) {
        const collection = await show()

        const columns = collection.columns?.slice() || []

        const index = columns.findIndex(c => c.id === id)

        if (index === -1) return

        columns.splice(index, 1)

        await update({ columns })
    }

    return { show, addColumn, updateColumn, deleteColumn }
}

export function useCollectionItems(workspaceId: string, collectionId: string){

    if (!workspaceId || !collectionId) {
        return ref([])
    }
    
    const loading = useState<boolean>(`workspace:${workspaceId}:collection:${collectionId}:loading`, false)
    const items = useState<CollectionFolderItem[]>(`workspace:${workspaceId}:collection:${collectionId}:items`, [])

    if (!items.value.length && !loading.value) {
        loading.value = true

        useCase<DataResponse<CollectionFolderItem[]>>('list-items', { workspaceId, collectionId })
            .then(r => items.value = r.data)
            .catch(() => items.value = [])
            .finally(() => loading.value = false)
    }


    return items
}

export async function useCollectionAsync(workspaceId: string, collectionId: string, forceUpdate = false){

    if (!workspaceId || !collectionId) {
        return ref(null)
    }
    
    const collection = useState<Collection | null>(`workspace:${workspaceId}:collection:${collectionId}`, null)

    if (!collection.value || forceUpdate) {
        await useCase<DataResponse<Collection>>('show-collection', { workspaceId, collectionId })
            .then(r => collection.value = r.data)
            .catch(() => collection.value = null)
    }


    return collection
}

export async function useCollectionItemsAsync(workspaceId: string, collectionId: string){

    if (!workspaceId || !collectionId) {
        return ref<CollectionFolderItem[]>([])
    }
    
    const loading = useState<boolean>(`workspace:${workspaceId}:collection:${collectionId}:loading`, false)
    const items = useState<CollectionFolderItem[]>(`workspace:${workspaceId}:collection:${collectionId}:items`, [])

    loading.value = true

    await useCase<DataResponse<CollectionFolderItem[]>>('list-items', { workspaceId, collectionId })
        .then(r => items.value = r.data)
        .catch(() => items.value = [])
        .finally(() => loading.value = false)

    return items
}

export function onCollectionUpdate(workspaceId: string, collectionId: string, cb: HookEventListener['handler']) {
    hooks.on({
        name: createCollectionKey(workspaceId, collectionId, 'update'),
        handler: cb,
    })
}