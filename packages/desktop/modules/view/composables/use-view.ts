import { computed, ref } from 'vue'

import View from '@core/entities/view'

import { createViewStore } from '../store'

export function useView<T extends View>(collectionId: string, viewId: string, payload: T) {
    const store = createViewStore(collectionId)

    const innerView = ref(payload)
    const storeView = computed(() => store.get(viewId))

    const view = computed<T>({
        get() {
            if (storeView.value) {
                return storeView.value
            }

            return innerView.value
        },
        set(value) {
            if (storeView.value) {
                return store.set(viewId, value)
            }

            innerView.value = value
        },
    })

    return view
}
