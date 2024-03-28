<script lang="ts" setup>

// general
const classMap = ref(new Map<string, string>())
const classes = computed(() => Array.from(classMap.value.values()).join(' '))

classMap.value.set('general', 'overflow-hidden')

// color
const color = defineProp<'body-800'>('color',  {
    type: String,
    default: 'body-800',
})

function setColor(){
    const options = {
        'body-800': 'bg-body-800',
    }

    const option = options[color.value]

    classMap.value.set('color', option)
}

watch(color, setColor, { immediate: true })

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
    <div :class="classes">
        <slot />
    </div>
</template>
