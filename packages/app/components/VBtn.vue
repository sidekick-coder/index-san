<script setup lang="ts">
import { useVariant } from '../composables/use-variant'
import { useCss } from '../composables/css'

const props = defineProps({
    mode: {
        type: String as () => 'default' | 'text',
        default: 'default',
    },
    size: {
        type: String as () => 'none' | 'xs' | 'sm' | 'md',
        default: 'md',
    },
    type: {
        type: String,
        default: 'button',
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
    tile: {
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
    href: {
        type: String,
        default: null,
    },
    loading: {
        type: Boolean,
        default: false,
    },
})

// color

const css = useCss()

const colorVariation = useVariant(props, 'color')

function setColorOptions() {
    if (props.mode === 'text') {
        return colorVariation.setOptions({
            'accent': 'hover:border-accent/5 hover:bg-accent/5 hover:text-accent',
            'danger': 'hover:border-danger/5 hover:bg-danger/5 hover:text-danger',
            'warn': 'hover:border-warn/5 hover:bg-warn/5 hover:text-warn',
            'info': 'hover:border-info/5 hover:bg-info/5 hover:text-info',
            'b-primary': 'hover:border-b-primary/5 hover:bg-b-primary/5 hover:text-t-primary',

            '_shared': 'border border-transparent',
            '_empty': (v) => {
                if (!css.isColor(v)) return { classes: v }

                return {
                    styles: `--color:${v}`,
                    classes: [
                        'hover:border-[var(--color)]',
                        'hover:bg-[var(--color)]',
                        'hover:text-[var(--color)]',
                    ].join(' '),
                }
            },
        })
    }

    colorVariation.setOptions({
        'accent': 'bg-accent hover:bg-accent/75',
        'danger': 'bg-danger hover:bg-danger/75',
        'info': 'bg-info hover:bg-info/75',
        'warn': 'bg-warn hover:bg-warn/75',
        'b-primary': 'bg-b-primary hover:bg-b-primary/75',
        'b-secondary': 'bg-b-secondary hover:bg-b-secondary/75',

        '_shared': 'text-t-primary',
        '_empty': (v) => {
            if (!css.isColor(v)) return { classes: v }

            return {
                styles: `--color:${v}`,
                classes: 'bg-[var(--color)]',
            }
        },
    })
}

watch(() => props.mode, setColorOptions, { immediate: true })

// size

const sizeVariation = useVariant(props, 'size', {
    none: '',
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
})

// mount classes & styles

const classes = computed(() => {
    const result = [
        'transition-all flex items-center justify-center overflow-hidden cursor-pointer',
        'outline-none focus:outline-none',
    ]

    if (props.disabled) {
        result.push('opacity-60 pointer-events-none')
    }

    if (!props.tile) {
        result.push(props.rounded ? 'rounded-full' : 'rounded')
    }

    return result.concat(colorVariation.classes).concat(sizeVariation.classes)
})

const styles = computed(() => colorVariation.styles)
</script>
<template>
    <component
        :is="to ? 'router-link' : href ? 'a' : 'button'"
        :to="to"
        :href="href"
        :target="href ? '_blank' : undefined"
        :class="classes"
        :style="styles"
        :disabled="disabled"
        :type="type"
    >
        <div v-if="loading" class="absolute flex items-center justify-center">
            <v-icon name="spinner" class="animate-spin" />
        </div>

        <div :class="[loading ? 'opacity-0' : '']">
            <slot />
        </div>
    </component>
</template>
