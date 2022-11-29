<script lang="ts">
export default { name: 'IsChartBar' }
</script>

<script setup lang="ts">
import set from 'lodash/set'
import get from 'lodash/get'

import { Chart, registerables } from 'chart.js'
import { onMounted, onUnmounted, ref } from 'vue'

Chart.register(...registerables)

const props = defineProps({
    options: {
        type: Object as any,
        default: null,
    },
})

const options = { ...props.options }

// set helper functions
function tooltipCallback(context: any) {
    let datasetLabel = context.dataset.label || ''
    let label = context.raw || ''

    const prefix = get(context, 'dataset.unitPrefix')
    const suffix = get(context, 'dataset.unitSuffix')

    if (prefix) {
        label = prefix + label
    }

    if (suffix) {
        label = label + suffix
    }

    return datasetLabel + ': ' + label
}

set(options, 'options.plugins.tooltip.callbacks.label', tooltipCallback)

// load chart
let chart: Chart
const root = ref()
onMounted(() => {
    chart = new Chart(root.value, options)
})

onUnmounted(() => {
    if (chart) chart.destroy()
})
</script>
<template>
    <canvas ref="root" />
</template>
