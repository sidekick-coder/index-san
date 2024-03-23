<script setup lang="ts">
import { toCssMeasurement } from '@composables/utils'

const props = defineProps({
    height: {
        type: [String, Number],
        default: null,
    },
})

// style

const style = computed(() => {
    const result: any = {}

    if (props.height) {
        result.height = toCssMeasurement(props.height)
    }

    return result
})
</script>
<template>
    <tr :style="style">
        <slot />
    </tr>
</template>
