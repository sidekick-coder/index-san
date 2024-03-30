<script lang="ts" setup>
// general
const classMap = ref(new Map<string, string>())
const classes = computed(() => Array.from(classMap.value.values()).join(' '))

classMap.value.set('general', 'fixed h-dvh top-0 z-50')

// model
const model = defineModel({
    type: Boolean,
    default: false,
})

// position
const position = defineProp<'left' | 'right'>('position', {
    type: String,
    default: 'left',
})

function setPosition(){
    const options: Record<typeof position.value, string> = {
        left: 'left-0',
        right: 'right-0',
    }

    const option = options[position.value]

    classMap.value.set('position', option)
}

watch(position, setPosition, { immediate: true })

// color
const color = defineProp<'body-700' | 'primary'>('color', {
    type: String,
    default: 'body-700',
})

function setColor(){
    const options: Record<typeof color.value, string> = {
        'body-700': 'bg-body-700 border-l border-body-500',
        primary: 'bg-primary-700',
    }

    const option = options[color.value]

    classMap.value.set('color', option)
}

watch(color, setColor, { immediate: true })

// width
const width = defineProp<'md'>('width', {
    type: String,
    default: 'md',
})

function setWidth(){
    const options: Record<typeof width.value, string> = {
        md: 'w-96',
    }

    const option = options[width.value]

    classMap.value.set('width', option)
}

watch(width, setWidth, { immediate: true })

// title
const title = defineProp<string>('title', {
    type: String,
    default: '',
})

</script>

<template>
    <div
        v-if="model"
        class="fixed inset-0 size-full bg-body-900/50 z-30 backdrop-blur-sm"
        @click="model = false"
    />

    <div
        v-if="model"
        :class="classes"
    >
        <div class="px-4 py-4 flex">
            <div class="text-lg font-bold flex-1">
                {{ title }}
            </div>

            <is-btn
                variant="text"
                size="none"
                class="h-8 w-8"
                @click="model = false"
            >
                <is-icon
                    name="heroicons:x-mark-solid"
                />
            </is-btn>
        </div>
        <slot />
    </div>
</template>
