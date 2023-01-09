import { ref, watch, WatchStopHandle } from 'vue'
import { defineStore } from 'pinia'
import debounce from 'lodash/debounce'

import { useStore as useWorkspace } from '@/modules/workspace/store'
import { useStore as useCollection } from '@/modules/collection/store'

import Column from '@core/entities/column'
import { useNonReactive } from '@/composables/utils'

interface StoreItem {
    collectionId: string
    loading: boolean
    watcher?: WatchStopHandle
    columns: Column[]
}

export const useStore = defineStore('column', () => {
    const items = ref<StoreItem[]>([])

    const workspace = useWorkspace()
    const collection = useCollection()

    async function set(collectionId: string, forceUpdate = false) {
        let item = items.value.find((i) => i.collectionId === collectionId)

        if (!item) {
            item = {
                collectionId,
                loading: false,
                columns: [],
            }

            items.value.push(item)
        }

        if (item.loading) return

        if (!forceUpdate && item.columns.length) return

        if (item.watcher) item.watcher()

        item.loading = true

        await collection.setCollections()

        const data = collection.collections.find((c) => c.id === collectionId)

        if (!data) return

        item.columns = useNonReactive(data.columns)

        setTimeout(() => {
            const index = items.value.findIndex((i) => i.collectionId === collectionId)

            items.value[index].loading = false

            items.value = items.value.slice()

            items.value[index].watcher = watch(
                () => items.value[index].columns,
                debounce(() => save(collectionId), 500),
                {
                    deep: true,
                }
            )
        }, 800)
    }

    function all(collectionId: string) {
        const item = items.value.find((i) => i.collectionId === collectionId)

        return item?.columns || []
    }

    function get(collectionId: string, columnId: string) {
        const item = items.value.find((i) => i.collectionId === collectionId)

        if (!item) return null

        const column = item.columns.find((c) => c.id === columnId)

        if (column) return column

        return null
    }

    async function show(collectionId: string, columnId: string): Promise<Column | null> {
        if (!collection.collections.length) {
            await collection.setCollections()
        }

        const search = collection.collections.find((c) => c.id === collectionId)

        if (!search) return null

        const column = search.columns.find((c) => c.id === columnId)

        return column ? useNonReactive(column) : null
    }

    function isLoading(collectionId: string) {
        const item = items.value.find((i) => i.collectionId === collectionId)

        if (!item) return false

        return item.loading
    }

    async function create(collectionId: string) {
        await collection.setCollections()

        const item = items.value.find((i) => i.collectionId === collectionId)

        if (!item) return

        item.columns.push(new Column({ label: 'New' }))
    }

    async function save(collectionId: string) {
        const item = items.value.find((i) => i.collectionId === collectionId)

        await collection.setCollections()

        const data = collection.collections.find((c) => c.id === collectionId)

        if (!item || !data) return

        await collection.update({
            workspaceId: workspace.currentId!,
            collectionId,
            data: {
                columns: item.columns,
            },
        })
    }

    async function destroy(collectionId: string, columnId: string) {
        const item = items.value.find((i) => i.collectionId === collectionId)

        if (!item) return null

        const index = item.columns.findIndex((c) => c.id === columnId)

        if (index === -1) return

        item.columns.splice(index, 1)
    }

    return {
        all,
        get,
        show,
        set,
        isLoading,
        create,
        save,
        destroy,
    }
})
