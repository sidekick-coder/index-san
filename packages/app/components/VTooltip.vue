<script lang="ts">
export default {
    name: 'VTooltip',
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { computed, onUnmounted, ref, watch, onMounted } from 'vue'
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

const mouse = ref({
    x: 0,
    y: 0,
})

const onMouseover = debounce((event: MouseEvent) => {
    const el = event.target as HTMLElement

    if (!el || !el.matches(':hover')) {
        show.value = false
        return
    }

    mouse.value.y = event.clientY + 20
    mouse.value.x = event.clientX

    show.value = true
}, 500)

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
    <slot name="activator" :attrs="{ onMouseover, onMouseleave }" :toggle="toggle" />

    <teleport to="body">
        <div
            v-show="show"
            :style="style"
            class="v-tooltip z-20 fixed transition-all overflow-auto max-h-screen"
            v-bind="$attrs"
        >
            <v-card :color="color" class="text-xs p-2">
                <slot />
            </v-card>
        </div>
    </teleport>
</template>
