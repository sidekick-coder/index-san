<script lang="ts" setup>

// general
const classMap = ref(new Map<string, string>())
const classes = computed(() => Array.from(classMap.value.values()).join(' '))

classMap.value.set('general', 'inline-flex items-center justify-center')

// color
const color = defineProp<'accent'>('color',  {
    type: String,
    default: 'accent',
})

function setColor(){
    const options = {
        accent: 'bg-teal-500',
    }

    const option = options[color.value]

    classMap.value.set('color', option)
}

watch(color, setColor, { immediate: true })

// size
const size = defineProp<'sm' | 'md' | 'lg'>('size', {
    type: String,
    default: 'md',
})

function setSize(){
    const options = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    }

    const option = options[size.value]

    classMap.value.set('size', option)
}

watch(size, setSize, { immediate: true })

// rounded
const rounded = defineProp<'sm' | 'md' | 'lg'>('rounded', {
    type: String,
    default: 'md',
})

function setRounded(){
    const options = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
    }

    const option = options[rounded.value]

    classMap.value.set('rounded', option)
}

watch(rounded, setRounded, { immediate: true })

</script>

<template>
    <button :class="classes">
        <slot></slot>
    </button>
</template>
