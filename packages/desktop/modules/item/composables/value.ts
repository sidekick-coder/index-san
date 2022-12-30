import { computed, ref, watch } from 'vue'
import debounce from 'lodash/debounce'

import Column from '@core/entities/column'
import Item from '@core/entities/item'

import { useStore } from '@/store/global'

export function createValue<T = string | undefined>() {
    const store = useStore()

    // state

    const state = ref({
        collectionId: '',
        columnId: '',
        itemId: '',
    })

    function load(args: typeof state.value) {
        state.value = args
    }

    // loading

    const loading = ref({
        column: false,
        item: false,
        all: computed(() => loading.value.column || loading.value.item),
    })

    // column

    const column = ref<Column | null>(null)

    async function setColumn() {
        const { collectionId, columnId } = state.value

        if (!collectionId || !columnId) {
            column.value = null
            return
        }

        loading.value.column = true

        await store.column
            .show(collectionId, columnId)
            .then((r) => (column.value = r))
            .finally(() => setTimeout(() => (loading.value.column = false), 500))
    }

    watch(() => state.value.columnId, setColumn, { deep: true, immediate: true })

    // item

    const item = ref<Item | null>(null)

    async function setItem() {
        const { collectionId, itemId } = state.value

        if (!collectionId || !itemId) {
            item.value = null
            return
        }

        loading.value.item = true

        await store.item
            .show(collectionId, itemId)
            .then((r) => (item.value = r))
            .finally(() => setTimeout(() => (loading.value.item = false), 500))
    }

    watch(() => state.value.itemId, setItem, { immediate: true })

    // payload

    const payload = ref<T>()

    async function setPayload() {
        if (!column.value || !item.value) return

        payload.value = item.value[column.value.field]
    }

    async function savePayload() {
        const { collectionId, itemId } = state.value

        if (!column.value || !item.value) return

        const original = item.value[column.value.field]

        if (original === payload.value) return

        const data = {
            [column.value.field]: payload.value,
        }

        await store.item.update(collectionId, itemId, data)
    }

    watch([item, column], setPayload, { immediate: true })

    watch(payload, debounce(savePayload, 1000))

    return {
        load,
        loading,
        payload,
        item,
        column,
    }
}
