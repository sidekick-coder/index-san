<script setup lang="ts">
import { toCssMeasurement } from '@composables/utils'
import { computed } from 'vue'

const props = defineProps({
    noPadding: {
        type: Boolean,
        default: false,
    },
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
    <td
        class="text-left border-b border-r last:border-r-0 border-lines whitespace-nowrap overflow-hidden"
        :class="[noPadding ? 'p-0' : 'py-2 px-4']"
        :style="style"
    >
        <slot />
    </td>
</template>
