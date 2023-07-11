import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useStore as useWorkspace } from '@modules/workspace/store'

import Item from '@index-san/core/entities/item'

import { useCase } from '@composables/use-case'
import { useHooks } from '@plugins/hooks'

function createStore(collectionId: string) {
    const workspace = useWorkspace()
    const hooks = useHooks()

    const items = ref<Item[]>([])
    const loading = ref(false)

    async function load(forceUpdate = false) {
        if (items.value.length && !forceUpdate) return

        loading.value = true

        await useCase('list-items', {
            collectionId,
            workspaceId: workspace.currentId!,
        })
            .then((r) => (items.value = r.data))
            .catch(() => (items.value = []))

        setTimeout(() => (loading.value = false), 500)
    }

    function get(id: string) {
        const item = items.value.find((i) => i.id === id)

        return item ?? null
    }

    async function create(payload: Item) {
        await useCase('create-item', {
            collectionId,
            workspaceId: workspace.currentId!,
            data: payload,
        }).then((r) => items.value.unshift(r.data))
    }

    async function update(id: string, payload: Partial<Item>) {
        await useCase('update-item', {
            workspaceId: workspace.currentId!,
            collectionId,
            itemId: id,
            data: payload,
        })

        const index = items.value.findIndex((i) => i.id === id)

        Object.assign(items.value[index], payload)

        hooks.emit('item:updated', { collectionId, itemId: id, payload })
    }

    async function destroy(id: string) {
        await useCase('delete-item', {
            workspaceId: workspace.currentId!,
            collectionId,
            itemId: id,
        })

        const index = items.value.findIndex((i) => i.id === id)

        items.value.splice(index, 1)
    }

    function clear() {
        items.value = []
    }

    return {
        items,
        loading,

        load,
        get,
        create,
        update,
        destroy,
        clear,
    }
}

export function useItemStore(collectionId: string) {
    const mount = defineStore(`items:${collectionId}`, () => createStore(collectionId))

    return mount()
}

export const useStore = defineStore('item', () => {
    const workspace = useWorkspace()
    const hooks = useHooks()

    async function list(collectionId: string): Promise<Item[]> {
        return useCase('list-items', { workspaceId: workspace.currentId!, collectionId })
            .then((r) => r.data)
            .catch(() => [])

        return []
    }

    async function show(collectionId: string, itemId: string) {
        const all = await list(collectionId)

        const item = all.find((i) => i.id === itemId)

        return item || null
    }

    async function create(collectionId: string, payload: Item) {
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

        hooks.emit('item:deleted', { collectionId, itemId })
    }

    return {
        list,
        show,
        create,
        update,
        destroy,
    }
})
