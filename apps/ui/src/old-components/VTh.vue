<script setup lang="ts">
import { toCssMeasurement } from '@composables/utils'
import { computed } from 'vue'

const props = defineProps({
    width: {
        type: [String, Number],
        default: null,
    },
    noPadding: {
        type: Boolean,
        default: false,
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
        class="text-left border-b border-r last:border-r-0 relative border-lines transition-width"
        :class="[noPadding ? '' : 'py-2 px-4']"
        :style="style"
    >
        <slot />
    </th>
</template>
