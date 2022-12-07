<script setup lang="ts">
import { ISArray } from '@/composables/array'
import {
    updateOrCreateCollectionView,
    useCollectionItems,
    useCollectionViews,
    ViewChart,
} from '@/composables/collection'
import { ref, watch } from 'vue'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    collectionId: {
        type: String,
        required: true,
    },
    viewId: {
        type: String,
        default: null,
    },
    title: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        default: 'bar',
    },
    colors: {
        type: Array,
        default: () => [],
    },
})

// items
const [items, setItems] = useCollectionItems()

watch(
    props,
    async () => {
        await setItems(props.workspaceId, props.collectionId)
    },
    { deep: true, immediate: true }
)

// View
const [views, setViews] = useCollectionViews()

const view = ref<ViewChart>({
    title: props.title,
    type: props.type,
    datasets: [],
})

async function updateOptions(data: any) {
    view.value = data

    if (!props.viewId) return

    await updateOrCreateCollectionView(
        props.workspaceId,
        props.collectionId,
        props.viewId,
        view.value
    )
}

watch(
    props,
    async () => {
        await setViews(props.workspaceId, props.collectionId)

        const search = views.value.find((v) => v.id === props.viewId)

        if (search) {
            Object.keys(search).forEach((key) => {
                view.value[key] = search[key]
            })
        }
    },
    { deep: true, immediate: true }
)

// chart config

const chart = ref({
    loading: false,
    options: {
        type: props.type,
        data: {
            labels: [] as string[],
            datasets: [] as any[],
        },
    },
})

function setChart() {
    chart.value.loading = true

    chart.value.options.type = view.value.type

    chart.value.options.data.datasets = []

    view.value.datasets.forEach((dataset) => {
        const data = new ISArray(items.value).apply(dataset.rules)

        const yData = data.apply(dataset.yRules)
        const xData = data.apply(dataset.xRules)

        const result = {
            label: dataset.label ?? '-',
            data: [] as any[],
            backgroundColor: dataset.colors ? dataset.colors.split(',') : ['red', 'blue', 'yellow'],
        }

        if (['pie'].includes(view.value.type)) {
            result.data = xData.value
            const labels = chart.value.options.data.labels.slice()

            chart.value.options.data.labels = labels.concat(yData.value)

            chart.value.options.data.datasets.push(result)
            return
        }

        result.data = xData.value.map((x, i) => ({
            x,
            y: yData.value[i],
        }))

        chart.value.options.data.datasets.push(result)
    })

    setTimeout(() => (chart.value.loading = false), 500)
}

watch(view, setChart, { deep: true })
</script>
<template>
    <is-card>
        <is-card-head>
            <is-card-title v-if="view.title"> {{ view.title }} </is-card-title>

            <div class="grow" />

            <is-dialog>
                <template #activator="{ on }">
                    <is-btn text size="sm" v-bind="on">
                        <is-icon name="bug" />
                    </is-btn>
                </template>

                <is-card color="b-primary" class="w-[800px] h-[500px] border border-lines">
                    <is-code-editor
                        :model-value="JSON.stringify(chart.options, null, 4)"
                        language="json"
                        readonly
                    />
                </is-card>
            </is-dialog>

            <is-collection-chart-config :edited-item="view" @save="updateOptions" />

            <is-btn text size="sm" @click="setChart">
                <is-icon name="arrows-rotate" />
            </is-btn>
        </is-card-head>

        <is-card-content v-if="chart.loading"> Loading... </is-card-content>

        <template v-else>
            <is-card-content
                v-if="!chart.options.data.datasets.length"
                class="py-5 text-lines justify-center"
            >
                {{ $t('noEntity', [$t('dataset', 2)]) }}
            </is-card-content>

            <is-card-content v-else>
                <is-chart :options="chart.options" />
            </is-card-content>
        </template>
    </is-card>
</template>
