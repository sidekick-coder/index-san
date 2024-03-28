<script lang="ts" setup>
import ApexCharts from 'apexcharts'

const options = defineModel({
    type: Object,
    default: null
})

const root = ref<HTMLElement | null>(null)

let chart: ApexCharts | null = null

function load(){
    if (!options.value) return
    if (!root.value) return

    if (chart) {
        chart.destroy()
    }

    chart = new ApexCharts(root.value, options.value);
    
    chart.render();
}

watch(options, load, { immediate: true })
</script>

<template>
    <div
        ref="root"
        class="w-full h-full"
    />
</template>
