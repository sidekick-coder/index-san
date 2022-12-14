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
    disabled: {
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
    none: '',
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
}

const variations = {
    default: {
        'accent': 'bg-accent hover:bg-accent/75',
        'danger': 'bg-danger hover:bg-danger/75 text-t-primary',
        'info': 'bg-info hover:bg-info/75 text-t-primary',
        'b-secondary': 'bg-b-secondary hover:bg-b-secondary/75 text-t-primary',
    },
    text: {
        'accent':
            'hover:border-accent/5 hover:bg-accent/5 border border-transparent hover:text-accent',
        'danger':
            'hover:border-danger/5 hover:bg-danger/5 border border-transparent hover:text-danger',
        'info': 'hover:border-info/5 hover:bg-info/5 border border-transparent hover:text-info',
        'lines': 'hover:border-lines/5 hover:bg-lines/5 border border-transparent hover:text-lines',
        'b-primary':
            'hover:border-b-primary/5 hover:bg-b-primary/5 border border-transparent hover:text-b-primary',
        'b-secondary':
            'hover:border-b-secondary/5 hover:bg-b-secondary/5 border border-transparent hover:text-b-secondary',
    },
}

const classes = computed(() => {
    const result: string[] = [
        'transition-all flex items-center justify-center overflow-hidden cursor-pointer',
    ]

    let colors = variations.default

    if (props.text) {
        colors = variations.text
    }

    if (props.disabled) {
        result.push('opacity-60 pointer-events-none')
    }

    result.push(props.rounded ? 'rounded-full' : 'rounded')

    result.push(sizes[props.size])
    result.push(colors[props.color])

    return result
})
</script>
<template>
    <component :is="to ? 'router-link' : 'button'" :to="to" :class="classes" :disabled="disabled">
        <div v-if="loading" class="absolute flex items-center justify-center">
            <is-icon name="spinner" class="animate-spin" />
        </div>

        <div :class="[loading ? 'opacity-0' : '']">
            <slot />
        </div>
    </component>
</template>
