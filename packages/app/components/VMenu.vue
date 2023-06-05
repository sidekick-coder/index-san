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
    maxHeight: {
        type: String,
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

// Show

// Position

const activatorRef = ref(null as null | HTMLElement)
const contentRef = ref(null as null | HTMLElement)
const model = defineModel()
const show = useDefinedRef(model, ref(false))
const position = ref({
    x: 0,
    y: 0,
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

function toggle() {
    if (show.value) {
        show.value = false
        return
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

onClickOutside(
    contentRef,
    () => {
        if (!props.closeOnContentClick) return

        show.value = false
    },
    {
        ignore: [activatorRef],
    }
)

// style
const style = computed(() => {
    const result = {
        top: `${position.value.y}px`,
        left: `${position.value.x}px`,
    }

    if (props.maxHeight) {
        result['max-height'] = `${props.maxHeight}px`
    }

    return result
})
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
            >
                <slot />
            </div>
        </transition>
    </teleport>
</template>
