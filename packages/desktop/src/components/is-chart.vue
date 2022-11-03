<script lang="ts">
export default { name: 'IsChart' }
</script>

<script setup lang="ts">
import { Chart, registerables, ChartTypeRegistry } from 'chart.js'
import { computed, onMounted, ref } from 'vue'
import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'

Chart.register(...registerables)

const props = defineProps({
    items: {
        type: Array as () => Record<string, string>[],
        default: () => []
    },
    columns: {
        type: Array as () => any[],
        default: () => []
    },
    type: {
        type: String as () => keyof ChartTypeRegistry,
        default: 'bar'
    },
    title: {
        type: String,
        default: 'Dataset'
    },
    labelKey: {
        type: String,
        default: null
    },
    valueKey: {
        type: String,
        default: null
    },
    groupBy: {
        type: String,
        default: null
    },
    groupByValue: {
        type: String,
        default: null
    },
    colors: {
        type: Array as () => string[],
        default: () => [
            '#ef4444',
            '#22c55e',
            '#14b8a6',
            '#3b82f6'
        ]
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

const root = ref()
const chart = ref<Chart>()

const data = computed(() => {
    
    if (!props.groupBy) {
        return props.items.map((item, index) => ({
            label: item[props.labelKey] || index,
            value: item[props.valueKey] || index,
        }))
    }

    const result: any[] = []

    const groups = groupBy(props.items, props.groupBy)

    Object.entries(groups)
        .forEach(([name, items]) => {
            result.push({
                label: name,
                value: sumBy(items, props.groupByValue)
            })
        }) 

    return result
})

const style = {
    width: props.width ? `${props.width}px` : undefined,
    height: props.height ? `${props.height}px` : undefined,
}

function setChart(){
    chart.value = new Chart(root.value, {
        type: props.type,
        data: {
            labels: data.value.map(i => i.label),
            datasets: [
                {
                    label: props.title,
                    data: data.value.map(i => i.value),
                    backgroundColor: props.colors,
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
            
        }
    })

}

onMounted(setChart)
</script>
<template>
    <div :style="style">
        <canvas ref="root" />
    </div>
</template>