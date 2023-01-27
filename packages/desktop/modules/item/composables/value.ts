import { computed, ref, watch } from 'vue'

import { useStore } from '@store/global'
import { useItemStore } from '../store'
import { useColumnStore } from '@modules/column/store'

interface Params {
    collectionId: string
    itemId: string
    columnId: string
}

export function createValue<T = string | undefined>({ collectionId, columnId, itemId }: Params) {
    // column
    let columnStore = useColumnStore(collectionId)

    const column = computed(() => columnStore.get(columnId))

    async function setColumn() {
        columnStore = useColumnStore(collectionId)

        if (!columnStore.columns.length) {
            await columnStore.load()
        }
    }

    // item

    const itemStore = useItemStore(collectionId)

    const item = computed(() => itemStore.get(itemId))

    async function setItem() {
        if (!itemStore.items.length) {
            await itemStore.load()
        }
    }

    // payload

    const payload = ref<T>()

    async function setPayload() {
        if (!column.value || !item.value) return

        payload.value = item.value[column.value.field]
    }

    watch(() => {
        if (!column.value || !item.value) return

        return item.value[column.value.field]
    }, setPayload)

    async function save() {
        if (!column.value || !item.value) return

        const data = {
            [column.value.field]: payload.value,
        }

        await itemStore.update(itemId, data)
    }

    // load

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
