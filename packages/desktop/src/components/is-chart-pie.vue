<script lang="ts">
export default { name: 'IsChartBar' }
</script>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { onMounted, ref, computed, onUnmounted } from 'vue'

import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'
import { useMeasurement } from '@/composables/measurement'
import { useTheme } from '@/composables/theme'

Chart.register(...registerables)

const props = defineProps({
    items: {
        type: Array as () => Record<string, string>[],
        default: () => [],
    },
    labelKey: {
        type: String,
        required: false,
        default: '',
    },
    valueKey: {
        type: String,
        required: true,
    },
    valueSuffix: {
        type: String,
        default: '',
    },
    groupBy: {
        type: String,
        default: null,
    },
    percentage: {
        type: Boolean,
        default: false,
    },
    showLegend: {
        type: Boolean,
        default: true,
    },
    width: {
        type: String,
        default: undefined,
    },
    height: {
        type: String,
        default: undefined,
    },
})

const measurement = useMeasurement()
const theme = useTheme()

const root = ref()
const chart = ref<Chart<'pie'>>()
const total = sumBy(props.items, props.valueKey)

const style = {
    width: measurement.toSize(props.width),
    height: measurement.toSize(props.height),
}

const data = computed(() => {
    if (props.groupBy) {
        return Object.entries(groupBy(props.items, props.groupBy)).map(([label, items]) => {
            let value: string | number = sumBy(items, props.valueKey)

            if (props.percentage) {
                value = (value / total) * 100

                value = value.toFixed(2)
            }

            return {
                label,
                value,
            }
        })
    }

    return props.items.map((item, index) => ({
        label: props.labelKey ? item[props.labelKey] : index,
        value: item[props.valueKey],
    }))
})

function load() {
    chart.value = new Chart(root.value, {
        type: 'pie',
        data: {
            labels: data.value.map((d) => d.label),
            datasets: [
                {
                    data: data.value.map((d) => Number(d.value)),
                    backgroundColor: theme.chartColors(),
                    borderColor: '#18181b',
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: props.showLegend,
                },
                tooltip: {
                    callbacks: {
                        label({ raw, label }) {
                            let value = raw

                            if (/^\d+$/.test(String(value))) {
                                value = Number(value).toLocaleString()
                            }

                            return ` ${label} ${value}${props.valueSuffix}`
                        },
                    },
                },
            },
        },
    })
}

onMounted(load)
onUnmounted(() => chart.value?.destroy())
</script>
<template>
    <div :style="style">
        <canvas ref="root" />
    </div>
</template>
