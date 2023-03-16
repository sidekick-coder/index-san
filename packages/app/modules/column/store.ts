import debounce from 'lodash/debounce'

import { useNonReactive } from '@composables/utils'
import Column from '@core/entities/column'

import { useStore as useCollection } from '@modules/collection/store'
import { defineStore } from 'pinia'

export function createColumnsStore(collectionId: string) {
    const collectionStore = useCollection()

    const columns = ref<Column[]>([])

    async function load() {
        if (!collectionStore.collections.length) {
            await collectionStore.setCollections()
        }

        const collection = collectionStore.get(collectionId)

        if (!collection) {
            columns.value = []
            return
        }

        columns.value = useNonReactive(collection.columns)
    }

    async function save() {
        await collectionStore.update(
            collectionId,
            { columns: useNonReactive(columns.value) },
            false
        )
    }

    const saveWithDebounce = debounce(save, 500)

    watch(columns, saveWithDebounce, { deep: true })

    function get(id: string) {
        const column = columns.value.find((c) => c.id === id)

        if (column) return column

        return null
    }

    async function create(payload: Partial<Column>) {
        const column = new Column(payload)

        columns.value.push(column)

        saveWithDebounce()
    }

    async function destroy(columnId: string) {
        const index = columns.value.findIndex((c) => c.id === columnId)

        if (index === -1) return

        columns.value.splice(index, 1)

        saveWithDebounce()
    }

    function clear() {
        columns.value = []
    }

    return {
        columns,
        load,
        save,
        get,
        create,
        destroy,
        clear,
    }
}

export const useColumnStore = (collectionId: string) => {
    const mount = defineStore(`column:${collectionId}`, () => createColumnsStore(collectionId))

    return mount()
}
