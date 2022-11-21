<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    size: {
        type: String,
        default: 'md'
    },
    color: {
        type: String,
        default: 'info'
    },
    text: {
        type: Boolean,
        default: false
    },
})

const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
}

const defaultColors = {
    info: 'bg-blue-500 hover:bg-blue-500/75',
}

const textColors = {
    info: 'hover:border-blue-500 border border-transparent hover:text-blue-500',
}

const colors = computed(() => {

    const result = defaultColors

    if (props.text) {
        Object.assign(result, textColors)
    }

    return result
})


const classes = computed(() => {
    const result: string[] = ['rounded transition-all']

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