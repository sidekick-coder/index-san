<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

import { LayoutItem, useLayout } from '@/composables/layout'

const props = defineProps({
    height: {
        type: Number,
        default: 40,
    },
})

// register & unregister layout item
const root = ref<HTMLElement>()

const layout = useLayout()

const item = {
    el: root.value,
    height: props.height,
    width: 0,
    isVisible: () => true,
    type: 'top',
}

onMounted(() => {
    item.el = root.value

    if (!item.el) return

    layout.value.add(item as LayoutItem)
})

onUnmounted(() => {
    layout.value.remove(item as LayoutItem)
})

// calculate padding
const padding = computed(() => {
    const right = layout.value.items
        .filter((item) => item.type === 'right')
        .filter((item) => item.isVisible())
        .reduce((acc, item) => acc + item.width, 0)

    const left = layout.value.items
        .filter((item) => item.type === 'left')
        .filter((item) => item.isVisible())
        .reduce((acc, item) => acc + item.width, 0)

    return `0 ${right}px 0 ${left}px`
})
</script>

<template>
    <div
        ref="root"
        class="absolute top-0 left-0 flex items-center w-full"
        :style="{ padding: padding, height: `${height}px` }"
    >
        <div class="h-full w-full flex items-center" v-bind="$attrs">
            <slot />
        </div>
    </div>
</template>
