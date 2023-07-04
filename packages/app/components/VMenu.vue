<script lang="ts">
export default {
    name: 'VMenu',
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { TransitionProps } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useDefinedRef } from '@composables/utils'
import delay from 'lodash/delay'

// Props & Emits
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: null,
    },
    offsetY: {
        type: Boolean,
        default: false,
    },
    offsetX: {
        type: Boolean,
        default: false,
    },
    width: {
        type: Number,
        default: null,
    },
    height: {
        type: Number,
        default: null,
    },
    closeOnContentClick: {
        type: Boolean,
        default: false,
    },
    openOnClick: {
        type: Boolean,
        default: true,
    },
    x: {
        type: Number,
        default: null,
    },
    y: {
        type: Number,
        default: null,
    },
    transition: {
        type: Object as PropType<TransitionProps>,
        default: () => ({
            enterActiveClass: 'transition duration-200',
            leaveActiveClass: 'transition duration-200',
            enterFromClass: 'opacity-0 translate-y-2',
            leaveToClass: 'opacity-100 translate-y-0',
        }),
    },
})

// Position

const activatorRef = ref(null as null | HTMLElement)
const contentRef = ref(null as null | HTMLElement)
const model = defineModel()
const show = useDefinedRef(model, ref(false))
const position = ref({
    x: 0,
    y: 0,
})

const maxPosition = ref({
    x: window.innerWidth,
    y: window.innerHeight,
})

const style = computed(() => {
    let x = props.x ?? position.value.x
    let y = props.y ?? position.value.y

    x = Math.min(x, maxPosition.value.x)
    y = Math.min(y, maxPosition.value.y)

    const result = {
        top: `${y}px`,
        left: `${x}px`,
    }

    return result
})

function onActivatorRef(el: HTMLElement | ComponentPublicInstance | null) {
    if (activatorRef.value) return

    if (!el) return

    if (el instanceof HTMLElement) {
        activatorRef.value = el
        return
    }

    if (el.$el instanceof HTMLElement) {
        activatorRef.value = el.$el
        return
    }
}

function setMaxPosition() {
    const rects = contentRef.value?.getBoundingClientRect()

    if (!rects) return

    if (!rects.width || !rects.height) return

    if (!props.width) {
        maxPosition.value.x = window.innerWidth - rects.width
        return
    }

    if (!props.height) {
        maxPosition.value.y = window.innerHeight - rects.height
        return
    }
}

function toggle() {
    if (show.value) {
        show.value = false
        return
    }

    if (props.width) {
        maxPosition.value.x = window.innerWidth - props.width
    }

    if (props.height) {
        maxPosition.value.y = window.innerHeight - props.height
    }

    const rects = activatorRef.value?.getBoundingClientRect()

    if (!rects) {
        show.value = true
        return
    }

    position.value.x = rects.x
    position.value.y = rects.y

    if (props.offsetY) {
        position.value.y += rects.height
    }

    if (props.offsetX) {
        position.value.x -= rects.width
    }

    show.value = true
}

function onClick() {
    if (props.openOnClick) {
        toggle()
    }
}

function onContentClick() {
    if (!props.closeOnContentClick) return

    show.value = false
}

onClickOutside(
    contentRef,
    () => {
        show.value = false
    },
    {
        ignore: [activatorRef],
    }
)

watch(show, () => delay(setMaxPosition, 100))
</script>

<template>
    <slot name="activator" :attrs="{ onClick, ref: onActivatorRef }" :toggle="toggle" />

    <teleport to="body">
        <transition v-bind="transition">
            <div
                v-show="show"
                ref="contentRef"
                :style="style"
                class="v-menu z-20 fixed transition-all overflow-auto max-h-screen"
                v-bind="$attrs"
                @click="onContentClick"
            >
                <slot />
            </div>
        </transition>
    </teleport>
</template>
