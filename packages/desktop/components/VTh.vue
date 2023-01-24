<script setup lang="ts">
import { toCssMeasurement } from '@composables/utils'
import { computed } from 'vue'

const props = defineProps({
    width: {
        type: [String, Number],
        default: null,
    },
})

const style = computed(() => {
    const result: any = {}

    if (props.width) {
        result.width = toCssMeasurement(props.width)
    }

    return result
})
</script>
<template>
    <th
        class="text-left py-2 px-4 border-b border-r last:border-r-0 relative border-lines transition-width"
        :style="style"
    >
        <slot></slot>
    </th>
</template>
