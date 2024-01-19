import { useVModel } from '@vueuse/core'
import { computed, ref } from 'vue'

export const useModelOrInnerValue: typeof useVModel = (props, key, emit) => {
    const model = useVModel(props, key, emit)
    const innerValue = ref()

    return computed({
        get() {
            if (model.value !== null) {
                return model.value
            }

            return innerValue.value
        },
        set(value) {
            if (model.value !== null) {
                model.value = value
                return
            }

            innerValue.value = value
        },
    })
}
