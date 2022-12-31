import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useStore as useWorkspace } from '@/modules/workspace/store'

import ListItemsDTO from '@core/use-cases/list-items/list-items.dto'
import Item from '@core/entities/item'

import { useCase } from '@/composables/use-case'
import { useHooks } from '../../plugins/hooks'
interface StoreItems {
    collectionId: string
    loading: boolean
    items: Item[]
}

export const useStore = defineStore('item', () => {
    const workspace = useWorkspace()
    const hooks = useHooks()
    const cache = new Map<string, Item[]>()

    const items = ref<StoreItems[]>([])

    async function setItems(collectionId: string, forceUpdate = false) {
        let storeItem = items.value.find((i) => i.collectionId === collectionId)

        if (!storeItem) {
            storeItem = {
                loading: false,
                collectionId,
                items: [],
            }

            items.value.push(storeItem)
        }

        if (!forceUpdate && storeItem.items.length) return

        storeItem.loading = true

        const raw: Item[] = await useCase('list-items', {
            collectionId,
            workspaceId: workspace.currentId!,
        })
            .then((r) => r.data)
            .catch(() => [])

        storeItem.items = raw

        items.value = items.value.slice()

        setTimeout(() => {
            storeItem!.loading = false
            items.value = items.value.slice()
        }, 800)
    }

    function all(collectionId: string): Item[] {
        const storeItem = items.value.find((i) => i.collectionId === collectionId)

        return storeItem?.items || []
    }

    function get(collectionId: string, itemId: string) {
        const storeItem = items.value.find((i) => i.collectionId === collectionId)

        if (!storeItem) return null

        const item = storeItem.items.find((i) => i.id === itemId)

        if (item) return item

        return null
    }

    function getStoreItem(collectionId: string) {
        return items.value.find((i) => i.collectionId === collectionId)
    }

    async function list(collectionId: string): Promise<Item[]> {
        let items = cache.get(collectionId)

        if (items) return items

        items = await useCase('list-items', { workspaceId: workspace.currentId!, collectionId })
            .then((r) => r.data)
            .catch(() => [])

        cache.set(collectionId, items)

        return items
    }

    async function show(collectionId: string, itemId: string) {
        const all = await list(collectionId)

        const item = all.find((i) => i.id === itemId)

        return item || null
    }

    async function create(collectionId: string, payload: Item) {
        cache.delete(collectionId)

        const { data } = await useCase('create-item', {
            collectionId,
            workspaceId: workspace.currentId!,
            data: payload,
        })

        hooks.emit('item:created', {
            collectionId,
            payload: data,
        })
    }

    async function update(collectionId: string, itemId: string, payload: Partial<Item>) {
        cache.delete(collectionId)

        await useCase('update-item', {
            workspaceId: workspace.currentId!,
            collectionId,
            itemId,
            data: payload,
        })

        hooks.emit('item:updated', { collectionId, itemId, payload })
    }

    async function destroy(collectionId: string, itemId: string) {
        await useCase('delete-item', {
            workspaceId: workspace.currentId!,
            collectionId,
            itemId,
        })

        cache.delete(collectionId)

        hooks.emit('item:deleted', { collectionId, itemId })
    }

    return {
        get,
        all,
        getStoreItem,
        setItems,

        list,
        show,
        create,
        update,
        destroy,
    }
})
