<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    size: {
        type: String,
        default: 'md',
    },
    color: {
        type: String,
        default: 'accent',
    },
    text: {
        type: Boolean,
        default: false,
    },
    rounded: {
        type: Boolean,
        default: false,
    },
    to: {
        type: String,
        default: null,
    },
    loading: {
        type: Boolean,
        default: false,
    },
})

const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2',
}

const defaultColors = {
    accent: 'bg-accent hover:bg-accent/75 disabled:opacity-80 disabled:cursor-not-allowed',
    danger: 'bg-danger hover:bg-danger/75 text-t-primary',
    info: 'bg-info hover:bg-info/75 text-t-primary',
}

const textColors = {
    accent: 'hover:border-accent/5 hover:bg-accent/5 border border-transparent hover:text-accent',
    danger: 'hover:border-danger/5 hover:bg-danger/5 border border-transparent hover:text-danger',
    info: 'hover:border-info/5 hover:bg-info/5 border border-transparent hover:text-info',
}

const colors = computed(() => {
    const result = defaultColors

    if (props.text) {
        Object.assign(result, textColors)
    }

    return result
})

const classes = computed(() => {
    const result: string[] = ['transition-all flex items-center justify-center overflow-hidden']

    result.push(props.rounded ? 'rounded-full' : 'rounded')

    result.push(sizes[props.size])
    result.push(colors.value[props.color])

    return result
})
</script>
<template>
    <component :is="to ? 'router-link' : 'button'" :to="to" :class="classes">
        <div v-if="loading" class="absolute flex items-center justify-center">
            <is-icon name="spinner" class="animate-spin" />
        </div>

        <div :class="[loading ? 'opacity-0' : '']">
            <slot />
        </div>
    </component>
</template>
