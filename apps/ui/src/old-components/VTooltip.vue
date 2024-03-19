<script lang="ts">
export default {
    name: 'VTooltip',
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

import debounce from 'lodash/debounce'

// Props & Emits
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: null,
    },
    color: {
        type: String,
        default: 'b-primary',
    },
    offsetY: {
        type: Boolean,
        default: false,
    },
    offsetX: {
        type: Boolean,
        default: false,
    },
    x: {
        type: Number,
        default: null,
    },
    y: {
        type: Number,
        default: null,
    },
    delay: {
        type: Number,
        default: 0,
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

function toggle() {
    show.value = !show.value
}

// track mouse position
const activatorRef = ref<HTMLElement | null>(null)

const mouse = ref({
    x: 0,
    y: 0,
})

function onRef(elOrComponent: null | HTMLElement | ComponentPublicInstance) {
    if (activatorRef.value) {
        return
    }

    if (!elOrComponent) {
        activatorRef.value = null
        return
    }

    if (elOrComponent instanceof HTMLElement) {
        activatorRef.value = elOrComponent
        return
    }

    activatorRef.value = elOrComponent.$el
}

const onMouseover = debounce((event: MouseEvent) => {
    const el = event.target as HTMLElement

    if (!el || !el.matches(':hover')) {
        show.value = false
        return
    }

    let x = event.clientX
    let y = event.clientY

    const [rects] = activatorRef.value?.getClientRects() ?? []

    if (rects) {
        x = rects.x
        y = rects.y + rects.height
    }

    mouse.value.y = y
    mouse.value.x = x

    show.value = true
}, props.delay)

function onMouseleave() {
    show.value = false
}

// style
const style = computed(() => {
    let y = props.y ?? mouse.value.y
    let x = props.x ?? mouse.value.x

    const result = {
        top: `${y}px`,
        left: `${x}px`,
    }

    return result
})
</script>

<template>
    <slot
        name="activator"
        :attrs="{ ref: onRef, onMouseover, onMouseleave }"
        :toggle="toggle"
    />

    <teleport to="body">
        <transition
            enter-active-class="transition duration-200"
            leave-active-class="transition duration-200"
            enter-from-class="opacity-0 translate-y-2"
            leave-to-class="opacity-0 translate-y-2"
        >
            <div
                v-show="show"
                :style="style"
                class="v-tooltip z-20 fixed transition-all overflow-auto max-h-screen"
                v-bind="$attrs"
            >
                <v-card
                    :color="color"
                    class="text-xs px-3 py-2 rounded"
                >
                    <slot />
                </v-card>
            </div>
        </transition>
    </teleport>
</template>
