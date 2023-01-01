import { onMounted, onUnmounted, ref } from 'vue'

import View from '@core/entities/view'

import { Events, useHooks } from '@/plugins/hooks'
import { useStore } from '../store'

interface Params<T> {
    collectionId: string
    viewId: string
    defaultValue: T
    createIfNotExist?: boolean
}

export function useView<T extends View>({
    collectionId,
    viewId,
    defaultValue,
    createIfNotExist,
}: Params<T>) {
    const store = useStore()
    const hooks = useHooks()

    const state = ref({
        collectionId,
        viewId,
        loading: true,
        saving: true,
    })

    const view = ref<T>(defaultValue)

    async function load(params?: Omit<Params<T>, 'defaultValue' | 'createIfNotExist'>) {
        if (params) {
            state.value.collectionId = params.collectionId
            state.value.viewId = params.viewId
        }

        state.value.loading = true

        const response = await store.show<T>(collectionId, viewId)

        if (response) {
            view.value = response
        }

        if (!response && createIfNotExist) {
            await store.create(collectionId, defaultValue)
        }

        setTimeout(() => (state.value.loading = false), 500)
    }

    async function save() {
        state.value.saving = true

        await store
            .update(collectionId, viewId, view.value)
            .finally(() => (state.value.saving = false))
    }

    function onUpdate(data: Events['view:updated']) {
        if (data.collectionId !== state.value.collectionId) return
        if (data.viewId !== state.value.viewId) return

        view.value = {
            ...view.value,
            ...data.payload,
        }
    }

    load()

    hooks.on('view:updated', onUpdate)

    onUnmounted(() => hooks.off('view:updated', onUpdate))

    return { view, state, load, save }
}
