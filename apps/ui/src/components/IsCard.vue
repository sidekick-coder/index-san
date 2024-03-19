<script lang="ts" setup>

// general
const classMap = ref(new Map<string, string>())
const classes = computed(() => Array.from(classMap.value.values()).join(' '))

classMap.value.set('general', '')

// color
const color = defineProp<'default' | 'zinc'>('color',  {
    type: String,
    default: 'default',
})

function setColor(){
    const options = {
        default: 'bg-zinc-100 text-zinc-900',
        zinc: 'bg-zinc-900 text-zinc-100',
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
