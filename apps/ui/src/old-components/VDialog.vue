<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: null,
    },
})
const emit = defineEmits(['update:modelValue'])

const innerModel = ref(false)
const model = useVModel(props, 'modelValue', emit)

const show = computed({
    get() {
        if (model.value !== null) {
            return model.value
        }

        return innerModel.value
    },
    set(value) {
        if (model.value !== null) {
            model.value = value
            return
        }

        innerModel.value = value
    },
})

function onClick() {
    show.value = !show.value
}

onKeyStroke('Escape', () => {
    show.value = false
})
</script>
<template>
    <slot
        name="activator"
        :attrs="{ onClick }"
    />

    <teleport to="body">
        <transition name="fade">
            <div
                v-if="show"
                class="fixed inset-0 flex items-center justify-center z-20"
            >
                <div
                    class="absolute z-10 inset-0 flex bg-b-primary/25 backdrop-blur-sm"
                    @click="show = false"
                />

                <div class="z-20">
                    <slot />
                </div>
            </div>
        </transition>
    </teleport>
</template>
