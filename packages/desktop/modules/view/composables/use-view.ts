import { onMounted, onUnmounted, ref } from 'vue'

import View from '@core/entities/view'

import { Events, useHooks } from '@/plugins/hooks'
import { useStore } from '../store'

interface Params<T> {
    collectionId: string
    viewId: string
    defaultValue: T
}

export function useView<T extends View>({ collectionId, viewId, defaultValue }: Params<T>) {
    const store = useStore()
    const hooks = useHooks()

    const state = ref({
        collectionId,
        viewId,
        loading: false,
    })

    const view = ref<T>(defaultValue)

    async function load(params?: Omit<Params<T>, 'defaultValue'>) {
        if (params) {
            state.value.collectionId = params.collectionId
            state.value.viewId = params.viewId
        }

        state.value.loading = true

        const response = await store.show<T>(collectionId, viewId)

        view.value = response ?? defaultValue

        state.value.loading = false
    }

    const saving = ref(false)

    async function save() {
        saving.value = true

        await store
            .update(collectionId, viewId, view.value)
            .finally(() => setTimeout(() => (saving.value = false), 500))
    }

    function onUpdate(data: Events['view:updated']) {
        if (data.collectionId !== collectionId) return
        if (data.viewId !== viewId) return
        if (saving.value) return

        view.value = {
            ...view.value,
            ...data.payload,
        }
    }

    onMounted(load)
    onMounted(() => hooks.on('view:updated', onUpdate))
    onUnmounted(() => hooks.off('view:updated', onUpdate))

    return { view, state, load, save }
}
