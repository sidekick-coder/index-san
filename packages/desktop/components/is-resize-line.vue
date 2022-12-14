<script setup lang="ts">
import { ref } from 'vue'

import debounce from 'lodash/debounce'

import { useVModel } from 'vue-wind/composables/v-model'

const props = defineProps({
    modelValue: {
        type: Number,
        required: true,
    },
    minWidth: {
        type: Number,
        default: null,
    },
    debounce: {
        type: Number,
        default: 1,
    },
})

const moving = ref(false)
const state = ref({
    x: 0,
    y: 0,
})

const emit = defineEmits(['update:modelValue'])
const model = useVModel(props, 'modelValue', emit)

const startWidth = ref(props.modelValue)

const drag = debounce((event: MouseEvent) => {
    const width = startWidth.value + event.clientX - state.value.x

    if (width >= props.minWidth || !props.minWidth) {
        model.value = width
    }
}, props.debounce)

function stop() {
    startWidth.value = model.value

    document.documentElement.removeEventListener('mousemove', drag, false)
    document.documentElement.removeEventListener('mouseup', stop, false)
}

function start(event: MouseEvent) {
    moving.value = true

    state.value.x = event.clientX
    state.value.y = event.clientY

    document.documentElement.addEventListener('mousemove', drag, false)
    document.documentElement.addEventListener('mouseup', stop, false)
}
</script>
<template>
    <div class="h-full w-[5px] absolute right-0 top-0 cursor-col-resize" @mousedown="start"></div>
</template>
