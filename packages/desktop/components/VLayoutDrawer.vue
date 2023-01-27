<script lang="ts">
export default defineComponent({ inheritAttrs: false })
</script>

<script setup lang="ts">
import { useLayout, LayoutItem } from '@composables/layout'
import { useVModel } from '@vueuse/core'

// Props & Emits
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: true,
    },
    right: {
        type: Boolean,
        default: false,
    },
    width: {
        type: Number,
        default: 300,
    },
})

const emit = defineEmits(['update:modelValue'])

const layout = useLayout()
const root = ref<HTMLElement>()

const item = {
    el: root.value,
    type: props.right ? 'right' : 'left',
    height: 0,
    width: props.width,
    isVisible: () => props.modelValue,
}

onMounted(() => {
    item.el = root.value

    if (!item.el) return

    layout.value.add(item as LayoutItem)
})

onUnmounted(() => {
    layout.value.remove(item as LayoutItem)
})

// padding
const padding = computed(() => {
    const top = layout.value.items
        .filter((item) => item.type === 'top')
        .filter((item) => item.isVisible())
        .reduce((acc, item) => acc + item.height, 0)

    return `${top}px 0 0 0`
})

// transform
const model = useVModel(props, 'modelValue', emit)

const style = computed(() => {
    let transform = 'translateX(0)'
    let width = `${props.width}px`

    if (!model.value) {
        transform = props.right ? 'translateX(200%)' : 'translateX(-100%)'
    }

    if (props.right && !model.value) {
        // width = `0px`
    }

    return {
        padding,
        transform,
        width,
    }
})
</script>
<template>
    <aside
        ref="root"
        class="absolute overflow-hidden top-0 h-full transition-transform duration-300 ease-in-out"
        :class="[right ? 'right-0' : 'left-0']"
        :style="(style as any)"
    >
        <div class="h-full w-full overflow-auto" v-bind="$attrs">
            <slot />
        </div>
    </aside>
</template>
