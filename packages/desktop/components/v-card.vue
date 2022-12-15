<script setup lang="ts">
import { computed } from 'vue'
import { toCssMeasurement } from '@/composables/utils'

const props = defineProps({
    width: {
        type: String,
        default: '100%',
    },
    height: {
        type: String,
        default: null,
    },
    color: {
        type: String,
        default: null,
    },
    text: {
        type: Boolean,
        default: false,
    },
})

// colors

const defaultColors = {
    'b-primary': 'bg-b-primary',
    'b-secondary': 'bg-b-secondary',

    'accent': 'bg-accent hover:bg-accent/75',
    'error': 'bg-red-500 hover:bg-red-500/75',
    'info': 'bg-blue-500 hover:bg-blue-500/75',
}

const colors = computed(() => {
    const result = defaultColors

    return result
})

// classes
const classes = computed(() => {
    const result: string[] = []

    if (props.color) {
        result.push(colors.value[props.color])
    }

    return result
})

// style

const style = computed(() => {
    const result: any = {}

    if (props.width) {
        result.width = toCssMeasurement(props.width)
    }

    if (props.height) {
        result.height = toCssMeasurement(props.height)
    }

    return result
})
</script>

<template>
    <div :class="classes" :style="style">
        <slot />
    </div>
</template>
