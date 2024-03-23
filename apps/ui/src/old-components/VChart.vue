<script setup lang="ts" type="module">
import set from 'lodash/set'
import get from 'lodash/get'

import { isJSON } from '@composables/utils'

// eslint-disable-next-line
// @ts-ignore
import { Chart } from 'chart.js/auto'

// eslint-disable-next-line
// @ts-ignore
import annotationPlugin from 'chartjs-plugin-annotation'

Chart.register(annotationPlugin)

const props = defineProps({
    options: {
        type: Object as any,
        default: null,
    },
})

let chartOptions: any | null = null

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

if (chartOptions) {
    set(chartOptions, 'options.plugins.tooltip.callbacks.label', tooltipCallback)
}

// set options using props
let chart: any

if (props.options) {
    chartOptions = { ...props.options }
}

// set options using slots
const slots = useSlots()

onMounted(() => {
    if (!slots.default || chartOptions) return

    const [child] = slots.default()

    if (!child) return

    const content = child.children as string

    if (!isJSON(content)) return

    chartOptions = JSON.parse(content)
})

// set chart
const root = ref()

onMounted(async () => {
    // const { Chart, registerables } = await import('chart.js')
    // const annotationPlugin = await import('chartjs-plugin-annotation')

    // Chart.register(...registerables, annotationPlugin)

    if (chartOptions && root.value) {
        chart = new Chart(root.value, chartOptions)
    }
})

onUnmounted(() => {
    if (chart) chart.destroy()
})
</script>
<template>
    <canvas ref="root" />
</template>
