import uuid from 'uuid-random'
import { ref, WritableComputedRef, Ref } from 'vue'

import Collection, { CollectionColumn, CollectionView } from '@core/entities/collection'
import { DataResponse, useCase } from './use-case'
import { useHooks, HookEventListener } from '../plugins/hooks'
import { useState, useStateV2 } from './state'
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


export function useCollection(workspaceId: string, collectionId: string){
    return useState<Collection | null>(createCollectionKey(workspaceId, collectionId), null)
}

export async function useCollectionAsync(workspaceId: string, collectionId: string, forceUpdate = false){

    if (!workspaceId || !collectionId) {
        return ref(null)
    }
    
    const collection = useCollection(workspaceId, collectionId)

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




export async function updateCollection(workspaceId: string, collectionId: string, data: Partial<Collection>, emitEvent = true){
    await useCase('update-collection', { workspaceId, collectionId, data })

    if (emitEvent) hooks.emit(createCollectionKey(workspaceId, collectionId, 'update'))
}

export function onCollectionUpdate(workspaceId: string, collectionId: string, cb: HookEventListener['handler']) {
    hooks.on({
        name: createCollectionKey(workspaceId, collectionId, 'update'),
        handler: cb,
    })
}

export async function updateCollectionColumn(workspaceId: string, collectionId: string, id: string, data: Partial<CollectionColumn>){
    const collection = await useCollectionAsync(workspaceId, collectionId)

    const columns = collection.value?.columns.slice() || []

    const column = columns.find(c => c.id === id)

    if (!column) return

    Object.keys(data)
        .filter(k => !['id'].includes(k))
        .forEach(key => {
            column[key] = data[key]
        })        

    await updateCollection(workspaceId, collectionId, { columns }, false)
}

export async function createCollectionColumn(workspaceId: string, collectionId: string, payload?: Partial<CollectionColumn>) {
    const id = uuid()

    const collection = await useCollectionAsync(workspaceId, collectionId)

    const data = {
        id,
        field: id,
        label: 'New',
        type: 'text',
        ...payload,
    }

    const columns = collection.value?.columns.slice() || []

    columns.push(data)

    await updateCollection(workspaceId, collectionId, { columns })    
}

export async function deleteCollectionColumn(workspaceId: string, collectionId: string, id: string) {
    const collection = await useCollectionAsync(workspaceId, collectionId)

    const columns = collection.value?.columns.slice() || []

    const index = columns.findIndex(c => c.id === id)

    if (index === -1) return

    columns.splice(index, 1)

    await updateCollection(workspaceId, collectionId, { columns })    
}

export async function updateOrCreateCollectionView(workspaceId: string, collectionId: string, id: string, data: Partial<CollectionView>) {
    const collection = await useCollectionAsync(workspaceId, collectionId)

    const views = collection.value?.views?.slice() || []

    if (!views.some(c => c.id === id)) {
        views.push( { id, filters: {} })
    }

    const view = views.find(c => c.id === id)

    if (!view) return

    Object.keys(data)
        .filter(k => !['id'].includes(k))
        .forEach(key => {
            view[key] = data[key]
        })        

    await updateCollection(workspaceId, collectionId, { views }, false)
}

export function useCollectionView(): [WritableComputedRef<CollectionView> | Ref<CollectionView>, (workspaceId: string, collectionId: string, name?: string) => Promise<void> ] {
    const state = ref<CollectionView>({
        filters: {},
        hiddenColumns: []
    })

    async function setState(workspaceId: string, collectionId: string, viewId?: string) {
        if (!viewId) {
            state.value = {  filters:  {} }
            return
        }

        const collection = await useCollectionAsync(workspaceId, collectionId)

        const view = collection.value?.views?.find(v => v.id === viewId)

        if (!view) return
        
        state.value = view
    }

    return [state, setState]
}

export function useCollectionColumns(){

    const [state, setKey] = useStateV2<CollectionColumn[]>([])

    async function setColumns(workspaceId: string, collectionId: string){

        setKey(createCollectionKey(workspaceId, collectionId, 'columns'))
        
        const collection = await useCollectionAsync(workspaceId, collectionId)

        state.value = collection.value?.columns.slice() || []

    }

    return [state, setColumns] as [typeof state, typeof setColumns]
}

function waitFor(cb: () => boolean){
    return new Promise<void>(resolve => {
        const interval = setInterval(() => {
            if (cb()) {
                resolve()
                clearInterval(interval)
            }
        }, 500)
    })
}

export function useCollectionItemsV2(){

    const [items, setItemsKey] = useStateV2<CollectionFolderItem[]>([])
    const [loading, setLoadingKey] = useStateV2<boolean>(false)

    async function setState(workspaceId: string, collectionId: string, forceUpdate = false){

        setItemsKey(createCollectionKey(workspaceId, collectionId, 'items'))
        setLoadingKey(createCollectionKey(workspaceId, collectionId, 'loading'))

        if (loading.value) {
            await waitFor(() => loading.value === false)
        }
        
        if (items.value.length && !forceUpdate) return
        
        loading.value = true

        await useCase<DataResponse<CollectionFolderItem[]>>('list-items', { workspaceId, collectionId })
            .then(r => items.value = r.data)
            .catch(() => items.value = [])
            .finally(() => loading.value = false)


    }

    return [items, setState] as [typeof items, typeof setState]
}