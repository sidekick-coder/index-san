import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useStore as useWorkspace } from '@/modules/workspace/store'

import ListItemsDTO from '@core/use-cases/list-items/list-items.dto'
import Item from '@core/entities/item'

import { useCase } from '@/composables/use-case'
interface StoreItems {
    collectionId: string
    loading: boolean
    items: Item[]
}

export const useStore = defineStore('item', () => {
    const workspace = useWorkspace()
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
        const storeItem = items.value.find((i) => i.collectionId === collectionId)

        if (storeItem) {
            storeItem.items.push(payload)
        }

        await useCase('create-item', {
            collectionId,
            workspaceId: workspace.currentId!,
            data: payload,
        }).catch(() => {
            if (storeItem) {
                storeItem.items.pop()
            }
        })
    }

    async function update(collectionId: string, id: string, payload: Partial<Item>) {
        await useCase('update-item', {
            collectionId,
            workspaceId: workspace.currentId!,
            itemId: id,
            data: payload,
        })
    }

    async function destroy(collectionId: string, itemId: string) {
        const storeItem = items.value.find((i) => i.collectionId === collectionId)

        if (!storeItem) return

        const index = storeItem.items.findIndex((i) => i.id === itemId)
        const item = storeItem.items.find((i) => i.id === itemId)

        if (index === -1 || !item) return

        storeItem.items.splice(index, 1)

        await useCase('delete-item', {
            collectionId,
            workspaceId: workspace.currentId!,
            itemId,
        }).catch(() => storeItem.items.push(item))
    }

    return {
        // items,
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
