<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useStore } from '@/modules/script/store'

import SOutput from './SOutput.vue'
import MEditor from '@/modules/monaco/components/MEditor.vue'
import VChart from '@/components/v-chart.vue'
import EvaluationOutput from '@/../core/entities/evaluation-output'

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
const current = ref<'chart' | 'debug' | 'raw'>('chart')

// execute script
const store = useStore()

const output = ref<EvaluationOutput>({
    error: null,
    result: null,
    logs: [],
})

async function execute() {
    output.value = await store.execute({
        content: content.value,
    })

    if (output.value.error || !output.value.result) {
        current.value = 'debug'
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
    <v-card :height="height" :width="width" :color="color">
        <div ref="contentEl" class="hidden">
            <slot />
        </div>

        <v-card-head class="pl-4 pr-2">
            <v-card-title v-if="title">
                {{ title }}
            </v-card-title>

            <v-btn text size="sm" class="ml-auto text-t-secondary" @click="refresh">
                <v-icon name="chart-pie" />
            </v-btn>

            <v-btn text size="sm" class="text-t-secondary" @click="refresh">
                <v-icon name="rotate" />
            </v-btn>

            <v-btn text size="sm" class="text-t-secondary" @click="current = 'raw'">
                <v-icon name="code" />
            </v-btn>

            <v-btn text size="sm" class="text-t-secondary" @click="current = 'debug'">
                <v-icon name="check-circle" />
            </v-btn>
        </v-card-head>

        <v-card-content v-if="current === 'raw'" style="height: calc(100% - 54px)">
            <m-editor :model-value="content" readonly />
        </v-card-content>

        <v-card-content v-else-if="current === 'debug'" style="height: calc(100% - 54px)">
            <s-output :output="output" />
        </v-card-content>

        <v-card-content
            v-else-if="chart.loading"
            style="height: calc(100% - 54px)"
            class="flex items-center justify-center animate-pulse"
        >
            <v-icon name="chart-pie" class="text-[10rem] text-lines" />
        </v-card-content>

        <transition v-else name="fade">
            <v-card-content
                v-if="!chart.loading && chart.options"
                style="height: calc(100% - 54px)"
            >
                <v-chart ref="chartRef" :options="chart.options" />
            </v-card-content>
        </transition>
    </v-card>
</template>
