<script setup lang="ts">
import { onMounted, ref, useSlots, watch } from 'vue'
import { useStore } from '@/modules/script/store'

import SOutput from './SOutput.vue'
import VChart from '@/components/v-chart.vue'

// Props & Emits

defineProps({
    width: {
        type: [String, Number],
        default: '500',
    },
    height: {
        type: [String, Number],
        default: '500',
    },
    title: {
        type: String,
        default: null,
    },
    color: {
        type: String,
        default: 'b-secondary',
    },
})

// set script content
const content = ref('')
const contentEl = ref<HTMLElement>()

onMounted(() => {
    if (!contentEl.value) return

    if (!contentEl.value.textContent) return

    const script = contentEl.value.textContent

    content.value = script
})

// toggle debug
const debug = ref(false)

// execute script
const store = useStore()

const output = ref({
    error: null,
    result: null,
    logs: [],
})

async function execute() {
    output.value = await store.execute({
        content: content.value,
    })

    if (output.value.error) {
        debug.value = true
    }
}

watch(content, execute)

// set chart options
const chart = ref({
    loading: false,
    options: null,
})

watch(output, (value) => {
    chart.value.loading = true

    chart.value.options = value.result

    setTimeout(() => (chart.value.loading = false), 800)
})

// refresh chart
const chartRef = ref<InstanceType<typeof VChart> | null>()

function refresh() {
    if (!chartRef.value) return

    chart.value.loading = true

    setTimeout(() => (chart.value.loading = false), 800)
}
</script>
<template>
    <is-card :height="height" :width="width" :color="color">
        <div ref="contentEl" class="hidden">
            <slot />
        </div>
        <is-card-head>
            <is-card-title v-if="title">
                {{ title }}
            </is-card-title>

            <is-btn text size="sm" class="ml-auto" @click="refresh">
                <is-icon name="rotate" />
            </is-btn>
            <is-btn text size="sm" @click="debug = !debug">
                <is-icon name="bug" />
            </is-btn>
        </is-card-head>

        <is-card-content v-if="debug" style="height: calc(100% - 54px)">
            <s-output :output="output" class="border-b border-l border-r border-lines" />
        </is-card-content>

        <is-card-content
            v-if="chart.loading"
            style="height: calc(100% - 54px)"
            class="flex items-center justify-center animate-pulse"
        >
            <is-icon name="chart-pie" class="text-[10rem] text-lines" />
        </is-card-content>

        <transition name="fade">
            <is-card-content
                v-if="!chart.loading && chart.options && !debug"
                style="height: calc(100% - 54px)"
            >
                <v-chart ref="chartRef" :options="chart.options" />
            </is-card-content>
        </transition>
    </is-card>
</template>
