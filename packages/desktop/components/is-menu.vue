<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

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
    maxHeight: {
        type: String,
        default: null,
    },
    closeOnContentClick: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue'])

// Show

const innerModel = ref(false)
const model = useVModel(props, 'modelValue', emit)

const show = computed({
    get() {
        if (model.value !== null) {
            return model.value
        }

        return innerModel.value
    },
    set(value) {
        if (model.value !== null) {
            model.value = value
            return
        }

        innerModel.value = value
    },
})

function onClick() {
    show.value = !show.value
}

// set max y & x position
const max = ref({
    el: null as null | HTMLElement,
    x: window.innerWidth,
    y: window.innerHeight - 300,
})

watch(
    () => max.value.el,
    (el) => {
        if (!el) return

        setTimeout(() => {
            max.value.y = window.innerHeight - el.clientHeight
            max.value.x = window.innerWidth - el.clientWidth
        }, 50)
    }
)

// track mouse position

const mouse = ref({
    el: null as null | HTMLElement,
    x: 0,
    y: 0,
})

function onMouseenter(event: MouseEvent) {
    const el = event.target as HTMLElement | null

    if (show.value || !el) return

    const rect = el.getBoundingClientRect()

    let y = rect.y
    let x = rect.x

    if (props.offsetY && el) {
        y += el.clientHeight
    }

    mouse.value.y = y
    mouse.value.x = x
    mouse.value.el = el
}

function onClickDom(event: MouseEvent) {
    if (!mouse.value.el) return

    if (!mouse.value.el.contains(event.target as any)) {
        show.value = false
    }
}

watch(show, (value) => {
    if (value) {
        return document.addEventListener('click', onClickDom)
    }

    document.removeEventListener('click', onClickDom)
})

onUnmounted(() => document.removeEventListener('click', onClickDom))

// style
const style = computed(() => {
    const result = {
        top: `${Math.min(mouse.value.y, max.value.y)}px`,
        left: `${Math.min(mouse.value.x, max.value.x)}px`,
    }

    // console.log(mouse.value.x, max.value.x)

    if (props.maxHeight) {
        result['max-height'] = `${props.maxHeight}px`
    }

    if (mouse.value.el) {
        result['min-width'] = `${mouse.value.el.clientWidth}px`
    }

    return result
})

// click on content
function onContentClick() {
    if (props.closeOnContentClick) {
        show.value = false
    }
}
</script>

<template>
    <slot name="activator" :on="{ onClick, onMouseenter }" />

    <teleport to="body">
        <transition name="slide-down">
            <div
                v-if="show"
                :ref="(el: any) => (max.el = el)"
                :style="style"
                class="is-menu z-20 fixed transition-all overflow-auto max-h-screen"
                v-bind="$attrs"
                @click.stop="onContentClick"
            >
                <slot />
            </div>
        </transition>
    </teleport>
</template>
