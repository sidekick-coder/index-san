<script setup lang="ts">
import { Icon } from '@iconify/vue'

// const props = defineProps({
//     name: {
//         type: String,
//         required: true,
//     },
//     size: {
//         type: String,
//         default: null,
//     },
// })

// general
const parentClasses = defineProp<any>('class', {
    type: [String, Array, Object],
    default: '',
})

const classMap = ref(new Map<string, string>())
const classes = computed(() => Array.from(classMap.value.values()).join(' '))

classMap.value.set('base', 'block')

// name
const name = defineProp<string>('name', {
    type: String,
    required: true,
})

// size
const size = defineProp<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('size', {
    type: String,
    default: 'md',
})

function setSize(){
    const options = {
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
    <span :class="[classes, parentClasses]">
        <Icon :icon="name"  />
    </span>
</template>
