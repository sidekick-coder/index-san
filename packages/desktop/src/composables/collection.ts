import uuid from 'uuid-random'

import Collection, { CollectionColumn, CollectionView } from '@core/entities/collection'
import { DataResponse, useCase } from './use-case'
import { useHooks, HookEventListener } from '../plugins/hooks'
import { useStateV2 } from './state'
import { CollectionFolderItem } from './item'

export interface ViewChartDataset {
    label: string
    rules: [string, string][]
    xRules: [string, string][]
    yRules: [string, string][]
    colors: string
}

export interface ViewChart {
    title: string
    type: string
    datasets: ViewChartDataset[]
}

const hooks = useHooks()

function waitFor(cb: () => boolean) {
    return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
            if (cb()) {
                resolve()
                clearInterval(interval)
            }
        }, 500)
    })
}

export function createCollectionKey(workspaceId: string, collectionId: string, ...args: string[]) {
    return ['workspaces', workspaceId, 'collections', collectionId, ...args].join(':')
}

export function useCollectionRepository(workspaceId: string) {
    function show(collectionId: string) {
        return useCase<DataResponse<Collection>>('show-collection', { workspaceId, collectionId })
    }

    function list() {
        return useCase<DataResponse<Collection[]>>('list-collections', { workspaceId })
    }

    function create(data?: Partial<Collection>) {
        return useCase('create-collection', { workspaceId, data })
    }

    function update(collectionId: string, data?: Partial<Collection>) {
        return useCase('update-collection', { workspaceId, collectionId, data })
    }

    function destroy(collectionId: string) {
        return useCase('delete-collection', { workspaceId, collectionId })
    }

    return { list, show, create, update, destroy }
}

export function useCollection() {
    const [collection, setCollectionKey] = useStateV2<Collection | null>(null)
    const [loading, setLoadingKey] = useStateV2(false)

    async function setCollection(workspaceId: string, collectionId: string, forceUpdate = false) {
        setCollectionKey(createCollectionKey(workspaceId, collectionId))
        setLoadingKey(createCollectionKey(workspaceId, collectionId, 'loading'))

        if (loading.value) {
            await waitFor(() => loading.value === false)
        }

        if (collection.value && !forceUpdate) return

        loading.value = true

        await useCase<DataResponse<Collection>>('show-collection', { workspaceId, collectionId })
            .then(({ data }) => (collection.value = data))
            .catch(() => (collection.value = null))
            .finally(() => (loading.value = false))
    }

    return [collection, setCollection] as [typeof collection, typeof setCollection]
}

export function useCollectionItems() {
    const [items, setItemsKey] = useStateV2<CollectionFolderItem[]>([])
    const [loading, setLoadingKey] = useStateV2(false)

    async function setItems(workspaceId: string, collectionId: string, forceUpdate = false) {
        setItemsKey(createCollectionKey(workspaceId, collectionId, 'items'))
        setLoadingKey(createCollectionKey(workspaceId, collectionId, 'items', 'loading'))

        if (loading.value) {
            await waitFor(() => loading.value === false)
        }

        if (items.value.length && !forceUpdate) return

        loading.value = true

        await useCase<DataResponse<CollectionFolderItem[]>>('list-items', {
            workspaceId,
            collectionId,
        })
            .then(({ data }) => (items.value = data))
            .catch(() => (items.value = []))
            .finally(() => (loading.value = false))
    }

    return [items, setItems, loading, setLoadingKey] as [
        typeof items,
        typeof setItems,
        typeof loading,
        typeof setLoadingKey
    ]
}

export async function updateCollection(
    workspaceId: string,
    collectionId: string,
    data: Partial<Collection>
) {
    const [, setCollection] = useCollection()

    await useCase('update-collection', { workspaceId, collectionId, data })

    await setCollection(workspaceId, collectionId, true)

    hooks.emit(createCollectionKey(workspaceId, collectionId, 'update'))
}

export function onCollectionUpdate(
    workspaceId: string,
    collectionId: string,
    cb: HookEventListener['handler']
) {
    hooks.on({
        pattern: createCollectionKey(workspaceId, collectionId, 'update'),
        handler: cb,
    })
}

export async function updateCollectionColumn(
    workspaceId: string,
    collectionId: string,
    id: string,
    data: Partial<CollectionColumn>
) {
    const [collection, setCollection] = useCollection()

    await setCollection(workspaceId, collectionId)

    const columns = collection.value?.columns.slice() || []

    const column = columns.find((c) => c.id === id)

    if (!column) return

    Object.keys(data)
        .filter((k) => !['id'].includes(k))
        .forEach((key) => {
            column[key] = data[key]
        })

    await updateCollection(workspaceId, collectionId, { columns })
}

export async function createCollectionColumn(
    workspaceId: string,
    collectionId: string,
    payload?: Partial<CollectionColumn>
) {
    const id = uuid()

    const [collection, setCollection] = useCollection()

    await setCollection(workspaceId, collectionId)

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

export async function deleteCollectionColumn(
    workspaceId: string,
    collectionId: string,
    id: string
) {
    const [collection, setCollection] = useCollection()

    await setCollection(workspaceId, collectionId)

    const columns = collection.value?.columns.slice() || []

    const index = columns.findIndex((c) => c.id === id)

    if (index === -1) return

    columns.splice(index, 1)

    await updateCollection(workspaceId, collectionId, { columns })
}

export async function updateOrCreateCollectionView(
    workspaceId: string,
    collectionId: string,
    id: string,
    data: Partial<CollectionView>
) {
    const [collection, setCollection] = useCollection()

    await setCollection(workspaceId, collectionId)

    const views = collection.value?.views?.slice() || []

    if (!views.some((c) => c.id === id)) {
        views.push({ id })
    }

    const view = views.find((c) => c.id === id)

    if (!view) return

    Object.keys(data)
        .filter((k) => !['id'].includes(k))
        .forEach((key) => {
            view[key] = data[key]
        })

    await updateCollection(workspaceId, collectionId, { views })
}

export function useCollectionColumns() {
    const [state, setKey] = useStateV2<CollectionColumn[]>([])

    async function setColumns(workspaceId: string, collectionId: string) {
        setKey(createCollectionKey(workspaceId, collectionId, 'columns'))

        const [collection, setCollection] = useCollection()

        await setCollection(workspaceId, collectionId)

        state.value = collection.value?.columns.slice() || []
    }

    return [state, setColumns] as [typeof state, typeof setColumns]
}

export function useCollectionViews() {
    const [views, setViewsKey] = useStateV2<CollectionView[]>([])
    const [loading, setLoadingKey] = useStateV2<boolean>(false)

    async function setViews(workspaceId: string, collectionId: string, forceUpdate = false) {
        setViewsKey(createCollectionKey(workspaceId, collectionId, 'views'))
        setLoadingKey(createCollectionKey(workspaceId, collectionId, 'views', 'loading'))

        if (loading.value) {
            await waitFor(() => loading.value === false)
        }

        if (views.value.length && !forceUpdate) return

        const [collection, setCollection] = useCollection()

        await setCollection(workspaceId, collectionId)

        views.value = collection.value?.views?.slice() || []
    }

    return [views, setViews] as [typeof views, typeof setViews]
}
