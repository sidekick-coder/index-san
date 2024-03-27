<script lang="ts" setup>

import { RouterLink } from 'vue-router';

// general
const classMap = ref(new Map<string, string>())
const classes = computed(() => Array.from(classMap.value.values()).join(' '))

classMap.value.set('general', 'inline-flex items-center justify-center')

// color
const variant = defineProp<'text' | 'fill'>('variant', {
    type: String,
    default: 'text',
})

const color = defineProp<'zinc' | 'accent' | 'primary'>('color',  {
    type: String,
    default: 'zinc',
})

function setFillColor(){
    const options: Record<typeof color.value, string> = {
        zinc: 'bg-zinc-500 hover-and-clickable:bg-zinc-400',
        accent: 'bg-teal-500',
        primary: 'bg-primary-500 text-body-500',
    }

    const option = options[color.value]

    classMap.value.set('color', option)
}

function setTextColor(){
    const options: Record<typeof color.value, string> = {
        zinc: 'text-zinc-400 hover:bg-zinc-400/5',
        accent: 'hover:text-teal-400 hover:bg-teal-400/5',
        primary: 'hover:text-primary-400 hover:bg-primary-400/5',
    }

    const option = options[color.value]

    classMap.value.set('color', option)
}

function setVariant(){
    const options = {
        text: setTextColor,
        fill: setFillColor,
    }

    const option = options[variant.value]

    if (!option) return

    option()
}

watch([color, variant], setVariant, { immediate: true })

// size
const size = defineProp<'none' | 'sm' | 'md' | 'lg'>('size', {
    type: String,
    default: 'md',
})

function setSize(){
    const options = {
        none: '',
        xs: 'px-2 py-0.5 text-xs',
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    }

    const option = options[size.value]

    classMap.value.set('size', option)
}

watch(size, setSize, { immediate: true })

// rounded
const rounded = defineProp<'none'| 'sm' | 'md' | 'lg' | 'full'>('rounded', {
    type: String,
    default: 'md',
})

function setRounded(){
    const options = {
        none: '',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    }

    const option = options[rounded.value]

    classMap.value.set('rounded', option)
}

watch(rounded, setRounded, { immediate: true })

// clickable
const to = defineProp<string>('to', {
    type: String,
    default: null,
})

</script>

<template>
    <component
        :is="to ? RouterLink : 'button'"
        :to="to"
        :class="classes"
    >
        <slot />
    </component>
</template>
