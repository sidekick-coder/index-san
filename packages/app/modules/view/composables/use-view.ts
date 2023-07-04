import View from '@core/entities/view'

import { useViewStore } from '../store'

export function useView<T extends View>(collectionId: string, viewId: string, payload: T) {
    const store = useViewStore(collectionId)

    const innerView = ref(payload)
    const storeView = computed(() => store.get(viewId))

    const view = computed<T>({
        get() {
            if (storeView.value) {
                return storeView.value as T
            }

            return innerView.value as T
        },
        set(value) {
            if (storeView.value) {
                return store.set(viewId, value)
            }

            innerView.value = value as any
        },
    })

    return view
}

export async function createViewIfNotExists<T extends View>(
    collectionId: string,
    viewId: string,
    payload: T
) {
    const store = useViewStore(collectionId)

    await store.load()

    const storeView = store.get(viewId)

    if (!storeView) {
        store.views.push(payload)
    }
}
