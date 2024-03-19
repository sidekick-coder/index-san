<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: null,
    },
    width: {
        type: String,
        default: '500',
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

function onClick(e: MouseEvent) {
    e.preventDefault()

    show.value = !show.value
}

// style

const style = computed(() => {
    const result = {}

    result['width'] = `${props.width}px`

    return result
})
</script>
<template>
    <slot name="activator" :attrs="{ onClick }" />

    <teleport to="body">
        <transition name="slide-left">
            <div v-if="show" class="fixed bg-accent/5 inset-0" @click="show = false"></div>
        </transition>

        <transition name="slide-left">
            <aside
                v-if="show"
                ref="root"
                class="fixed right-0 top-0 h-full border-l border-lines w-[500px] bg-b-primary overflow-y-auto"
                :style="style"
            >
                <slot :close="onClick" />
            </aside>
        </transition>
    </teleport>
</template>
