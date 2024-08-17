<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

// general
const className = defineProp<string | string[]>("class", {
    type: String,
    default: '',
})

const classMap = ref(new Map<string, string>())

const classes = computed(() => {
    return twMerge(Array.from(classMap.value.values()).join(' '), className.value)
})

classMap.value.set('base', 'block')

// name
const name = defineProp<string>('name', {
    type: String,
    required: true,
})

// size
const size = defineProp<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('size', {
    type: String,
    default: 'lg',
})

function setSize(){
    const options: Record<typeof size.value, string> = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
    }

    const option = options[size.value]

    classMap.value.set('size', option)
}

watch(size, setSize, { immediate: true })
</script>
<template>
    <Icon
        :icon="name"
        :class="classes"
    />
</template>
