import { useHooks, Events } from '@/plugins/hooks'
import { onUnmounted, ref } from 'vue'
import { AnyView, useStore } from '../store'

export function useAllViews(collectionId: string) {
    const store = useStore()
    const hooks = useHooks()

    const views = ref<AnyView[]>([])

    async function setAll() {
        views.value = await store.list(collectionId)
    }

    function onViewCreated(data: Events['view:created']) {
        if (data.collectionId !== collectionId) return

        views.value.push(data.payload)
    }

    function onViewDeleted(data: Events['view:deleted']) {
        if (data.collectionId === collectionId) return

        const index = views.value.findIndex((v) => v.id === data.collectionId)

        if (index === -1) return

        views.value.splice(index)
    }

    function onViewUpdated(data: Events['view:updated']) {
        if (data.collectionId !== collectionId) return

        views.value = views.value.map((v) => {
            if (v.id === data.viewId) {
                return {
                    ...v,
                    ...data.payload,
                }
            }

            return v
        })
    }

    setAll()

    hooks.on('view:created', onViewCreated)
    hooks.on('view:updated', onViewUpdated)
    hooks.on('view:deleted', onViewDeleted)

    onUnmounted(() => hooks.off('view:created', onViewCreated))
    onUnmounted(() => hooks.off('view:deleted', onViewDeleted))
    onUnmounted(() => hooks.off('view:updated', onViewUpdated))

    return { views }
}
