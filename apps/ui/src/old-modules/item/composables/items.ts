import Item from '@index-san/core/entities/item'
import { withViewIterations } from '@modules/view/composables'

import { Events, useHooks } from '@plugins/hooks'
import { computed, onMounted, onUnmounted, Ref, ref } from 'vue'
import { useStore } from '../store'

export function useItems(collectionId: string, view: Ref<any>) {
    const hooks = useHooks()
    const store = useStore()

    const raw = ref<Item[]>([])

    const items = computed(() => withViewIterations(raw.value, view.value))

    async function setItems() {
        raw.value = await store.list(collectionId)
    }

    function onItemCreated(data: Events['item:created']) {
        if (collectionId !== data.collectionId) return

        const index = raw.value.findIndex((i) => i.id === data.payload.id)

        if (index !== -1) return

        raw.value.push(data.payload)
    }

    function onItemUpdated(data: Events['item:updated']) {
        if (collectionId !== data.collectionId) return

        const item = raw.value.find((i) => i.id === data.payload.id)

        if (!item) return

        Object.assign(item, data.payload)
    }

    function onItemDeleted(data: Events['item:deleted']) {
        if (collectionId !== data.collectionId) return

        const index = raw.value.findIndex((i) => i.id === data.itemId)

        if (index === -1) return

        raw.value.splice(index, 1)
    }

    hooks.on('item:created', onItemCreated)
    hooks.on('item:updated', onItemUpdated)
    hooks.on('item:deleted', onItemDeleted)

    onUnmounted(() => hooks.off('item:created', onItemCreated))
    onUnmounted(() => hooks.off('item:updated', onItemUpdated))
    onUnmounted(() => hooks.off('item:deleted', onItemDeleted))

    onMounted(setItems)

    return { items, raw }
}
