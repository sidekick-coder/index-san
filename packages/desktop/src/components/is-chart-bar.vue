<script lang="ts">
export default { name: 'IsChartBar' }
</script>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { onMounted, ref, unref, onUnmounted, useSlots } from 'vue'
import { useMeasurement } from '@/composables/measurement'

import { useTheme } from '@/composables/theme'
import { useChildren } from '@/composables/children'

Chart.register(...registerables)

const props = defineProps({
    items: {
        type: Array as () => Record<string, string>[],
        default: () => []
    },
    width: {
        type: [String, Number],
        default: 300
    },
    height: {
        type: [String, Number],
        default: undefined
    },
})

const measurement = useMeasurement()
const children = useChildren(useSlots())
const components = ref<any[]>([])

const root = ref()

let chart: Chart

const datasets = ref<any[]>([])
const style = {
    width: measurement.toSize(props.width),
    height: measurement.toSize(props.height),
}

function load(){
    children.load()

    components.value = children.findComponent('IsChartBarDataset')
   
}

function create(){
    chart = new Chart(root.value, {
        type: 'bar',
        data: {
            datasets: datasets.value.slice()
        },
    })
}

function update(){
    if (!chart) return

    chart.data.datasets = datasets.value

    chart.update()
}

function setChart(){
    if (!datasets.value.length) return

    if (!chart) create()

    if (chart) update()
    
  
}
onMounted(load)
onUnmounted(() => chart?.destroy())

function setDataset(index: number, dataset: any[]){
    datasets.value[index] = dataset

    setChart()
}

</script>
<template>
    <div :style="style" >
        <canvas ref="root" />

        <component
            v-for="(c, index) in components"
            :key="index"
            :is="c"
            :items="items"
            @load="setDataset(index, $event)"
        />

    </div>
</template>