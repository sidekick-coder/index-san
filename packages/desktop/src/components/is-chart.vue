<script lang="ts">
export default { name: 'IsChartBar' }
</script>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { onMounted, onUnmounted, ref } from 'vue'

Chart.register(...registerables)

const props = defineProps({
    options: {
        type: Object as any,
        default: null,
    },
})

let chart: Chart
const root = ref()

onMounted(() => {
    chart = new Chart(root.value, props.options)
})

onUnmounted(() => {
    if (chart) chart.destroy()
})
</script>
<template>
    <canvas ref="root" />
</template>
