import { computed, ref, watch } from 'vue'
import debounce from 'lodash/debounce'

import Column from '@core/entities/column'
import Item from '@core/entities/item'

import { useStore } from '@/store/global'

interface Params {
    collectionId: string
    itemId: string
    columnId: string
}

export function createValue<T = string | undefined>({ collectionId, columnId, itemId }: Params) {
    // column

    const column = ref<Column | null>(null)

    async function setColumn() {
        await store.column
            .show(collectionId, columnId)
            .then((r) => (column.value = r))
            .catch(() => (column.value = null))
    }

    // item

    const item = ref<Item | null>(null)

    async function setItem() {
        await store.item
            .show(collectionId, itemId)
            .then((r) => (item.value = r))
            .catch(() => (item.value = null))
    }

    // payload

    const payload = ref<T>()

    async function setPayload() {
        if (!column.value || !item.value) return

        payload.value = item.value[column.value.field]
    }

    async function save() {
        if (!column.value || !item.value) return

        const original = item.value[column.value.field]

        if (original === payload.value) return

        const data = {
            [column.value.field]: payload.value,
        }

        await store.item.update(collectionId, itemId, data)
    }

    // load

    const store = useStore()

    const loading = ref(false)

    loading.value = true

    const subscriptions: Function[] = []

    async function load() {
        await setColumn()
        await setItem()
        await setPayload()

        subscriptions.forEach((fn) => fn())
    }

    function onLoaded(fn: () => any) {
        subscriptions.push(fn)
    }

    load().finally(() => setTimeout(() => (loading.value = false)))

    return {
        loading,
        payload,
        item,
        column,
        save,
        onLoaded,
    }
}
