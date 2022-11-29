<script setup lang="ts">
import { useCase } from '@/composables/use-case'
import Script from '@core/entities/script'
import { computed, ref, watch } from 'vue'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    scriptId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: null,
    },
})

// load script
const script = ref<Script>({
    id: '',
    name: 'Script',
    content: '',
})

// load script
async function setScript() {
    const { data: scripts } = await useCase('list-scripts', { workspaceId: props.workspaceId })

    const search = scripts.find((s: Script) => s.name === props.scriptId)

    if (!search) return

    script.value = search
}
watch(props, setScript, {
    immediate: true,
    deep: true,
})

// load chart

const chart = ref({
    loading: false,
    options: null as any,
})

const optionsIsValid = computed(() => {
    if (!chart.value.options) return false

    if (!chart.value.options.type) return false

    return true
})

async function setChart() {
    const data = {
        workspaceId: props.workspaceId,
        name: script.value.name,
    }

    chart.value.loading = true

    await useCase('execute-script', data)
        .then((r) => {
            chart.value.options = r.result
        })
        .finally(() => {
            chart.value.loading = false
        })
}

watch(() => script.value.id, setChart)
</script>

<template>
    <is-card>
        <is-card-head>
            <is-card-title v-if="title"> {{ title }} </is-card-title>

            <div class="grow" />

            <is-btn text size="sm" @click="setChart">
                <is-icon name="arrows-rotate" />
            </is-btn>
        </is-card-head>

        <is-card-content v-if="chart.loading"> Loading... </is-card-content>

        <is-card-content v-else-if="!optionsIsValid"> No data or invalid chat </is-card-content>

        <is-card-content v-else>
            <is-chart :options="chart.options" />
        </is-card-content>
    </is-card>
</template>
