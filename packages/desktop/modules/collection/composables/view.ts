import Collection from '@/../core/entities/collection'
import { useNonReactive } from '@/composables/utils'
import View from '@core/entities/view'
import debounce from 'lodash/debounce'
import { ref, watch } from 'vue'
import { useStore } from '../store'

export function useView<T extends View>(defaultView: T, serialize = (d: T) => d) {
    const store = useStore()

    const view = ref<T>(defaultView)
    const collectionId = ref('')
    const loading = ref(false)

    async function setView(collection: Collection, viewId?: string) {
        loading.value = true

        view.value.id = viewId || ''
        collectionId.value = collection.id

        view.value.columns = useNonReactive(collection.columns)

        if (!viewId) {
            loading.value = false
            view.value.merge(defaultView)
            return
        }

        await store.view
            .show(collection.id, viewId)
            // .then((response: View) => view.value.merge(response || {}))
            .finally(() => (loading.value = false))
    }

    const save = debounce(async () => {
        const data = serialize(view.value)

        await store.view.updateOrCreate({
            collectionId: collectionId.value,
            viewId: view.value.id,
            data,
        })
    }, 1000)

    watch(
        view,
        () => {
            if (loading.value) return

            save()
        },
        { deep: true }
    )

    return {
        view,
        loading,
        collectionId,
        setView,
        save,
    }
}
