<script lang="ts" setup>

import { RouterLink } from 'vue-router';
import { twMerge } from 'tailwind-merge'

// general
const className = defineProp<string | string[]>("class")
const classMap = ref(new Map<string, string>())
const classes = computed(() => {
    return twMerge(Array.from(classMap.value.values()).join(' '), className.value)
})

classMap.value.set('general', 'inline-flex items-center justify-center')

// color
const variant = defineProp<'text' | 'fill'>('variant', {
    type: String,
    default: 'fill',
})

const color = defineProp<'primary' | 'danger' | 'success' | 'warning'>('color',  {
    type: String,
    default: 'primary',
})

function setFillColor(){
    const options: Record<typeof color.value, string> = {
        primary: 'bg-primary-500 text-body-0',
		danger: 'bg-danger-500 text-body-0',
		success: 'bg-success-500 text-body-0',
		warning: 'bg-warning-500 text-body-0',

    }

    const option = options[color.value]

    classMap.value.set('color', option)
}

function setTextColor(){
    const options: Record<typeof color.value, string> = {
        primary: 'hover:bg-primary-400/50',
        danger: 'hover:bg-danger-400/50',
        success: 'hover:bg-sucess-400/50',
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

// disabled
const disabled = defineProp<boolean>('disabled', {
    type: Boolean,
    default: false,
})

function setDisabled(){
    if (disabled.value) {
        classMap.value.set('disabled', 'cursor-not-allowed opacity-50')
        return
    } 
    
    classMap.value.delete('disabled')
}

watch(disabled, setDisabled, { immediate: true })

</script>

<template>
    <component
        :is="to ? RouterLink : 'button'"
        :to="to"
        :class="classes"
        :disabled="disabled"
    >
        <slot />
    </component>
</template>
