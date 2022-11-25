<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = defineProps({
    to: {
        type: String,
        default: null,
    },
    dark: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: 'info',
    },
    size: {
        type: String,
        default: 'sm',
    },
})

const attrs = useAttrs()

const defaultColors = {
    accent: 'hover:bg-teal-500/5 hover:text-teal-500',
    danger: 'hover:bg-red-500/5 hover:text-red-500',
    info: 'hover:bg-blue-500/5 hover:text-blue-500',
}

const sizes = {
    xs: 'text-xs py-3 px-4',
    sm: 'text-sm py-3 px-4',
}

const classes = computed(() => {
    const result: string[] = ['w-full transition-all flex']

    result.push(sizes[props.size])

    if (attrs.onClick || props.to) {
        result.push('cursor-pointer', defaultColors[props.color])
    }

    if (props.dark) {
        result.push('text-white')
    }

    return result
})
</script>
<template>
    <router-link v-if="to" :to="to" :class="classes">
        <slot />
    </router-link>

    <div v-else :class="classes">
        <slot />
    </div>
</template>
