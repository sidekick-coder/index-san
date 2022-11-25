<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
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

// track mouse position

const mouse = ref({
    el: null as null | HTMLElement,
    x: 0,
    y: 0,
})

const style = computed(() => {
    return {
        top: `${mouse.value.y}px`,
        left: `${mouse.value.x}px`,
    }
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
</script>

<template>
    <slot name="activator" :on="{ onClick, onMouseenter }" />

    <teleport to="body">
        <transition name="slide-down">
            <div v-if="show" :style="style" class="is-menu fixed transition-all" @click.stop="">
                <slot />
            </div>
        </transition>
    </teleport>
</template>
