<script lang="ts" setup>
import ApexCharts from 'apexcharts'

const options = defineModel({
	type: Object,
	default: null
})

const root = ref<HTMLElement | null>(null)
const slots = useSlots()

let chart: ApexCharts | null = null

function loadFromProp() {
	chart = new ApexCharts(root.value, options.value);

	chart.render();
}

function loadFromSlot() {
	const text = slots.default!()[0].children as string

	const json = JSON.parse(text)

	chart = new ApexCharts(root.value, json);

	chart.render();
}


function load() {
	if (!root.value) return

	if (chart) {
		chart.destroy()
	}

	if (options.value) {
		return loadFromProp()
	}

	if (slots.default) {
		return loadFromSlot()
	}

}

onMounted(load)

watch(options, load)
</script>

<template>
    <div
        ref="root"
        class="w-full h-full"
    />
</template>
