<script lang="ts">
export default { name: 'IsChartBar' }
</script>

<script setup lang="ts">
import set from 'lodash/set'
import get from 'lodash/get'

import { isJSON } from '@composables/utils'

import { Chart, registerables } from 'chart.js'
import { onMounted, onUnmounted, ref, useSlots } from 'vue'

Chart.register(...registerables)

const props = defineProps({
    options: {
        type: Object as any,
        default: null,
    },
})

let options: any = null

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

if (options) {
    set(options, 'options.plugins.tooltip.callbacks.label', tooltipCallback)
}

// set options using props
let chart: Chart

if (props.options) {
    options = { ...props.options }
}

// set options using slots
const slots = useSlots()
onMounted(() => {
    if (!slots.default || options) return

    const [child] = slots.default()

    if (!child) return

    const content = child.children as string

    if (!isJSON(content)) return

    options = JSON.parse(content)
})

// set chart
const root = ref()

onMounted(() => {
    if (options && root.value) {
        chart = new Chart(root.value, options)
    }
})

onUnmounted(() => {
    if (chart) chart.destroy()
})
</script>
<template>
    <canvas ref="root" />
</template>
