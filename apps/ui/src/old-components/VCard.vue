<script setup lang="ts">
import { computed } from 'vue'
import { useCss } from '@composables/css'
import { useVariant } from '@composables/use-variant'

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
    to: {
        type: String,
        default: null,
    },
})

// colors

const colorVariation = useVariant(props, 'color', {
    'b-primary': 'bg-b-primary',
    'b-secondary': 'bg-b-secondary',

    'accent': 'bg-accent hover:bg-accent/75',
    'danger': 'bg-danger hover:bg-danger/75',
    'info': 'bg-info hover:bg-info/75',
    'warn': 'bg-warn hover:bg-warn/75',
    '_empty': (value) => {
        if (!css.isColor(value)) return { classes: value }

        return {
            styles: `--color:${value}`,
            classes: 'bg-[var(--color)]',
        }
    },
})

// class & styles
const css = useCss()

const classes = computed(() =>
    ['transition-all', 'flex', 'flex-col'].concat(colorVariation.classes)
)

const style = computed(() => {
    let result = ''

    if (props.width) {
        result += `width:${css.toMeasurement(props.width)};`
    }

    if (props.height) {
        result += `height:${css.toMeasurement(props.height)};`
    }

    return result + colorVariation.styles
})
</script>

<template>
    <component
        :is="to ? 'router-link' : 'div'"
        :to="to"
        :class="classes"
        :style="style"
    >
        <slot />
    </component>
</template>
