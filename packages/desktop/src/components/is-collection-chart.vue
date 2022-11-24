<script setup lang="ts">
import { ISArray } from '@/composables/array'
import {
    updateOrCreateCollectionView,
    useCollectionItems,
    useCollectionViews,
    ViewChart,
} from '@/composables/collection'
import { useTheme } from '@/composables/theme'
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
const theme = useTheme()

const chart = ref({
    loading: false,
    options: {
        type: props.type,
        data: {
            datasets: [] as any[],
        },
    },
})

function setChart() {
    chart.value.loading = true

    chart.value.options.data.datasets = []

    view.value.datasets.forEach((dataset) => {
        const data = new ISArray(items.value).apply(dataset.rules)

        const yData = new ISArray<number[]>(data.value).apply(dataset.yRules)
        const xData = new ISArray<string[]>(data.value).apply(dataset.xRules)

        const axis = xData.value.map((x, i) => ({
            x,
            y: yData.value[i],
        }))

        chart.value.options.data.datasets.push({
            label: dataset.label ?? '-',
            data: axis,
            backgroundColor: dataset.colors ? dataset.colors.split(',') : theme.chartColors(),
        })
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

            <is-collection-chart-config :edited-item="view" @save="updateOptions" />

            <is-btn text @click="setChart">
                <is-icon name="arrows-rotate" />
            </is-btn>
        </is-card-head>

        <is-card-content v-if="chart.loading"> Loading... </is-card-content>

        <template v-else>
            <is-card-content v-if="!chart.options.data.datasets.length">
                {{ $t('noEntity', [$t('dataset', 2)]) }}
            </is-card-content>

            <is-card-content v-else>
                <is-chart :options="chart.options" />
            </is-card-content>
        </template>
    </is-card>
</template>
