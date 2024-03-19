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
    clickable: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: 'accent',
    },
    size: {
        type: String,
        default: 'sm',
    },
    align: {
        type: String,
        default: 'center',
    },
})

const attrs = useAttrs()

const defaultColors = {
    accent: 'hover:bg-accent/5 hover:text-accent',
    danger: 'hover:bg-danger/5 hover:text-danger',
    info: 'hover:bg-info/5 hover:text-info',
}

const sizes = {
    none: '',
    xs: 'text-xs py-3 px-4',
    sm: 'text-sm h-12 px-4',
}

const alignments = {
    center: 'items-center',
    start: 'items-start',
    end: 'items-end',
    baseline: 'items-baseline',
}

const classes = computed(() => {
    const result: string[] = ['w-full transition-all flex']

    result.push(sizes[props.size] || props.size)
    result.push(alignments[props.align])

    if (attrs.onClick || props.to || props.clickable) {
        result.push('cursor-pointer', defaultColors[props.color] || props.color)
    }

    if (props.dark) {
        result.push('text-t-primary')
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
