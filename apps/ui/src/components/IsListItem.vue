<script lang="ts" setup>
import type { RouterLinkProps } from 'vue-router';
import { twMerge } from 'tailwind-merge'


// general

const attrs = useAttrs()
const className = defineProp<string | string[]>("class", {
    type: String,
    default: '',
})

const classMap = ref(new Map<string, string>())

const classes = computed(() => {
    return twMerge(Array.from(classMap.value.values()).join(' '), className.value)
})

classMap.value.set('base', 'w-full flex items-center transition-colors')

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
        lg: 'text-lg h-14 px-4',
        xl: 'text-xl h-12 px-4',
    }

    const option = options[size.value]

    classMap.value.set('size', option)
}

watch(size, setSize, { immediate: true })

// color
const variant = defineProp<'text' | 'fill'>('variant', {
    type: String,
    default: 'text',
})

const color = defineProp<'body' | 'accent'>('color', {
    type: String,
    default: 'body',
})

function setTextColor(){
    const options = {
        accent: 'text-teal-500 hover-and-clickable:bg-teal-500 hover-and-clickable:text-teal-500 [&.router-link-active]:bg-teal-500/5',
        body: 'text-body-50 hover-and-clickable:bg-body-600 [&.router-link-active]:bg-body-300/5',
    }

    const option = options[color.value]

    classMap.value.set('color', option)
}

function setFillColor(){
    const options = {
        accent: 'bg-teal-500 hover-and-clickable:bg-teal-400 [&.router-link-active]:bg-teal-400',
        body: 'bg-body-600 hover-and-clickable:bg-body-500 [&.router-link-active]:bg-body-500',
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

    option()
}

watch([color, variant], setVariant, { immediate: true })

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

    <div
        v-else
        :class="classes"
    >
        <slot />
    </div>
</template>
