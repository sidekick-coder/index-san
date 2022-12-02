<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
</script>
<template>
    <slot name="activator" :on="{ onClick }" />

    <teleport to="body">
        <transition name="slide-left">
            <div v-if="show" class="fixed bg-accent/5 inset-0" @click="show = false"></div>
        </transition>

        <transition name="slide-left">
            <aside
                v-if="show"
                ref="root"
                class="fixed right-0 top-0 h-full border-l border-lines w-[500px] bg-b-primary overflow-y-auto"
            >
                <slot />
            </aside>
        </transition>
    </teleport>
</template>
