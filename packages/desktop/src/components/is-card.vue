<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
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
    const result: string[] = ['w-full']

    if (props.color) {
        result.push(colors.value[props.color])
    }

    return result
})
</script>
<template>
    <div :class="classes">
        <slot />
    </div>
</template>
