<script lang="ts" setup>
import type { RouterLinkProps } from 'vue-router';


// general

const attrs = useAttrs()

const classMap = ref(new Map<string, string>())
const classes = computed(() => Array.from(classMap.value.values()).join(' '))

classMap.value.set('base', 'w-full flex items-center')

// size
const size = defineProp<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('size', {
    type: String,
    default: 'md',
})

function setSize(){
    const options = {
        xs: 'text-xs py-3 px-4',
        sm: 'text-sm h-12 px-4',
        md: 'text-md h-12 px-4',
        lg: 'text-lg h-12 px-4',
        xl: 'text-xl h-12 px-4',
    }

    const option = options[size.value]

    classMap.value.set('size', option)
}

watch(size, setSize, { immediate: true })

// color
const color = defineProp<'zinc'>('color', {
    type: String,
    default: 'zinc',
})

function setColor(){
    const options = {
        zinc: 'text-zinc-500 hover-and-clickable:bg-zinc-300/5 hover-and-clickable:text-zinc-300 [&.router-link-active]:bg-zinc-300/5',
    }

    const option = options[color.value]

    classMap.value.set('color', option)
}

watch(color, setColor, { immediate: true })

// clickable
const clickable = defineProp<boolean>('clickable', {
    type: Boolean,
    default: false,
})

const to = defineProp<RouterLinkProps['to']>('to', {
    type: [String, Object] as PropType<RouterLinkProps['to']>,
    default: null,
})

function setClickable(){
    let isClickable = clickable.value

    if (attrs.onClick) {
        isClickable = true
    }

    if (to.value) {
        isClickable = true
    }

    classMap.value.set('clickable', isClickable ? 'cursor-pointer' : '')
}

watch(clickable, setClickable, { immediate: true })

// justify
const justify = defineProp<'start' | 'center' | 'end'>('justify', {
    type: String,
    default: 'start',
})

function setJustify(){
    const options = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
    }

    const option = options[justify.value]

    classMap.value.set('justify', option)
}

watch(justify, setJustify, { immediate: true })

</script>

<template>
    <router-link
        v-if="to"
        :to="to"
        :class="classes"
    >
        <slot />
    </router-link>

    <div v-else :class="classes">
        <slot />
    </div>
</template>
