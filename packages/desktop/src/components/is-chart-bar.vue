<script lang="ts">
export default { name: 'IsChartBar' }
</script>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useMeasurement } from '@/composables/measurement'

import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'
import { useTheme } from '@/composables/theme'

Chart.register(...registerables)

const props = defineProps({
    items: {
        type: Array as () => Record<string, string>[],
        default: () => []
    },
    labelKey: {
        type: String,
        required: false,
    },
    labelPrefix: {
        type: String,
        default: ''
    },
    valueKey: {
        type: String,
        required: true,
    },
    valuePrefix: {
        type: String,
        default: ''
    },
    groupBy: {
        type: String,
        default: null
    },
    width: {
        type: String,
        default: undefined
    },
    height: {
        type: String,
        default: undefined
    },
})

const measurement = useMeasurement()
const theme = useTheme()

const root = ref()
const chart = ref<Chart>()
const style = {
    width: measurement.toSize(props.width),
    height: measurement.toSize(props.height),
}

const data = computed(() => {
    if (props.groupBy) {
        return Object.entries(groupBy(props.items, props.groupBy))
            .map(([label, items]) => ({
                label,
                value: sumBy(items, props.valueKey).toString()
            }))
    }

    return props.items.map((item, index) => ({
        label: props.labelKey ? item[props.labelKey] : index,
        value: item[props.valueKey]
    }))
})

function load(){
    chart.value = new Chart(root.value, {
        type: 'bar',
        data: {
            labels: data.value.map(d =>  `${props.labelPrefix}${d.label}`),
            datasets: [{
                data: data.value.map(d => Number( d.value)),
                backgroundColor: theme.chartColors(),                
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {                        
                        label({ raw }) {
                            let value = raw                            
                            
                            if (/^\d+$/.test(String(value))) {
                                value = Number(value).toLocaleString()
                            }

                            return ` ${props.valuePrefix}${value}`
                        }
                    }
                }
            }
        }
    })
}

onMounted(load)
onUnmounted(() => chart.value?.destroy())

</script>
<template>
    <div :style="style" >
        <canvas ref="root" />
    </div>
</template>