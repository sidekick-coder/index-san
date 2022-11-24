<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    size: {
        type: String,
        default: 'md',
    },
    color: {
        type: String,
        default: 'info',
    },
    text: {
        type: Boolean,
        default: false,
    },
    rounded: {
        type: Boolean,
        default: false,
    },
})

const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2',
}

const defaultColors = {
    accent: 'bg-teal-500 hover:bg-teal-500/75',
    error: 'bg-red-500 hover:bg-red-500/75 text-white',
    info: 'bg-blue-500 hover:bg-blue-500/75 text-white',
}

const textColors = {
    accent: 'hover:border-teal-500/5 hover:bg-teal-500/5 border border-transparent hover:text-teal-500',
    error: 'hover:border-red-500/5 hover:bg-red-500/5 border border-transparent hover:text-red-500',
    info: 'hover:border-blue-500/5 hover:bg-blue-500/5 border border-transparent hover:text-blue-500',
}

const colors = computed(() => {
    const result = defaultColors

    if (props.text) {
        Object.assign(result, textColors)
    }

    return result
})

const classes = computed(() => {
    const result: string[] = ['transition-all']

    result.push(props.rounded ? 'rounded-full' : 'rounded')

    result.push(sizes[props.size])
    result.push(colors.value[props.color])

    return result
})
</script>
<template>
    <button :class="classes">
        <slot />
    </button>
</template>
