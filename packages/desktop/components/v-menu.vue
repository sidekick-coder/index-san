<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { computed, onUnmounted, ref, watch, onMounted } from 'vue'
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

function onClick() {
    if (props.openOnClick) {
        toggle()
    }
}

// set max y & x position
const max = ref({
    loading: false,
    el: null as null | HTMLElement,
    x: window.innerWidth,
    y: window.innerHeight - 300,
})

watch(show, () => {
    const el = max.value.el

    if (!el) return

    max.value.loading = true

    setTimeout(() => {
        max.value.y = window.innerHeight - el.clientHeight
        max.value.x = window.innerWidth - el.clientWidth
    }, 100)

    setTimeout(() => (max.value.loading = false), 200)
})

// track mouse position

const mouse = ref({
    el: null as null | HTMLElement,
    x: 0,
    y: 0,
    elWidth: 0,
    elHeight: 0,
})

function setPosition() {
    let { el } = mouse.value

    if (!el || !el.getBoundingClientRect) return

    const rect = el.getBoundingClientRect()

    mouse.value.y = rect.y
    mouse.value.x = rect.x
    mouse.value.elWidth = el.clientWidth
    mouse.value.elHeight = el.clientHeight
}

onMounted(() => setTimeout(setPosition, 500))

function onClickDom(event: MouseEvent) {
    if (!show.value) return

    const isClickOnContent = max.value.el?.contains(event.target as any)

    if (!isClickOnContent) {
        show.value = false
    }

    if (props.closeOnContentClick) {
        show.value = false
    }
}

watch(show, (value) => {
    if (value) {
        setTimeout(() => document.addEventListener('click', onClickDom), 200)
        return
    }

    document.removeEventListener('click', onClickDom)
})

onUnmounted(() => document.removeEventListener('click', onClickDom))

// style
const style = computed(() => {
    let y = Math.min(props.y ?? mouse.value.y, max.value.y)
    let x = Math.min(props.x ?? mouse.value.x, max.value.x)

    if (props.offsetY) {
        y += mouse.value.elHeight
    }

    if (props.offsetX) {
        x -= mouse.value.elWidth
    }

    const result = {
        top: `${y}px`,
        left: `${x}px`,
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
</script>

<template>
    <slot
        name="activator"
        :attrs="{ onClick, ref: (el) => (mouse.el = el ? el.$el || el : el) }"
        :toggle="toggle"
    />

    <teleport to="body">
        <div
            v-show="show"
            :ref="(el: any) => (max.el = el)"
            :style="style"
            class="v-menu z-20 fixed transition-all overflow-auto max-h-screen"
            :class="max.loading ? 'opacity-0' : 'opacity-100'"
            v-bind="$attrs"
        >
            <slot />
        </div>
    </teleport>
</template>
