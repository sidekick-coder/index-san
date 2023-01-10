<script setup lang="ts">
import { computed } from 'vue'
import { toCssMeasurement } from '@/composables/utils'

const props = defineProps({
    width: {
        type: [String, Number],
        default: '100%',
    },
    height: {
        type: [String, Number],
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
    to: {
        type: String,
        default: null,
    },
})

// colors

const defaultColors = {
    'b-primary': 'bg-b-primary',
    'b-secondary': 'bg-b-secondary',

    'accent': 'bg-accent hover:bg-accent/75',
    'danger': 'bg-danger hover:bg-danger/75',
    'info': 'bg-info hover:bg-info/75',
    'warn': 'bg-warn hover:bg-warn/75',
}

const colors = computed(() => {
    const result = defaultColors

    return result
})

// classes
const classes = computed(() => {
    const result: string[] = []

    if (props.color) {
        result.push(colors.value[props.color] || props.color)
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
    <component :is="to ? 'router-link' : 'div'" :to="to" :class="classes" :style="style">
        <slot />
    </component>
</template>
