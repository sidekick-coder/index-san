<script lang="ts">
export default { inheritAttrs: false }
</script>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLayout, LayoutItem } from '@composables/layout'

// register & unregister layout item
const root = ref<HTMLElement>()

const layout = useLayout()

const item = {
    el: root.value,
    height: 0,
    width: 0,
    isVisible: () => true,
}

onMounted(() => {
    item.el = root.value

    if (!item.el) return

    layout.value.add(item as LayoutItem)
})

onUnmounted(() => {
    layout.value.remove(item as LayoutItem)
})

// set padding
const padding = computed(() => {
    const top = layout.value.items
        .filter((item) => item.type === 'top')
        .filter((item) => item.isVisible())
        .reduce((acc, item) => acc + item.height, 0)

    const left = layout.value.items
        .filter((item) => item.type === 'left')
        .filter((item) => item.isVisible())
        .reduce((acc, item) => acc + item.width, 0)

    const right = layout.value.items
        .filter((item) => item.type === 'right')
        .filter((item) => item.isVisible())
        .reduce((acc, item) => acc + item.width, 0)

    return `${top}px ${right}px 0 ${left}px`
})
</script>
<template>
    <div ref="root" class="w-full h-full" :style="`padding: ${padding}`">
        <slot />
    </div>
</template>
