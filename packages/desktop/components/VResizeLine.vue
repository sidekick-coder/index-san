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
    const width = Math.abs(startWidth.value + event.clientX - state.value.x)

    if (width % 4 !== 0) {
        return
    }

    if (props.minWidth && width <= props.minWidth) {
        return
    }

    model.value = width
}, props.debounce)

const stop = debounce(() => {
    startWidth.value = model.value
    moving.value = false

    window.removeEventListener('mousemove', drag, false)
    window.removeEventListener('mouseup', stop, false)
}, 50)

const start = debounce((event: MouseEvent) => {
    moving.value = true

    state.value.x = event.clientX
    state.value.y = event.clientY

    window.addEventListener('mousemove', drag, false)
    window.addEventListener('mouseup', stop, false)
}, 50)
</script>
<template>
    <div
        class="h-full w-[5px] absolute right-0 top-0 cursor-col-resize"
        :class="moving ? 'bg-accent' : ''"
        @mousedown="start"
    ></div>
</template>
