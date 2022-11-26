<script setup lang="ts">
import { ref, watch } from 'vue'
import { ViewChart, ViewChartDataset } from '@/composables/collection'

const emit = defineEmits(['save'])

const props = defineProps({
    editedItem: {
        type: Object as () => ViewChart,
        default: null,
    },
})

// main
const drawer = ref(false)

const payload = ref<ViewChart>({
    type: 'bar',
    title: '',
    datasets: [],
})

const chartTypes = ['bar', 'line', 'pie']

function save() {
    const data = {
        title: payload.value.title,
        type: payload.value.type,
        datasets: payload.value.datasets.slice(),
    }

    emit('save', data)

    drawer.value = false
}

watch(
    () => drawer.value,
    (value) => {
        if (!value) return

        if (props.editedItem) {
            payload.value = JSON.parse(JSON.stringify({ ...props.editedItem }))
            return
        }

        payload.value.title = ''
        payload.value.type = 'bar'
        payload.value.datasets = []
    }
)

// add dataset
function addDataset() {
    payload.value.datasets.push({
        label: 'New',
        colors: '',
        rules: [],
        xRules: [],
        yRules: [],
    })
}

// edit dataset
const editedIndex = ref<number>()
const rulesOptions = ['filter', 'map', 'groupBy', 'uniqBy', 'dateFormat', 'sum', 'get']
const editedData = ref<ViewChartDataset>({
    label: 'New',
    colors: '',
    rules: [],
    xRules: [],
    yRules: [],
})

function editDataset(index: number) {
    editedIndex.value = index

    Object.keys(editedData.value).forEach((key) => {
        editedData.value[key] = payload.value.datasets[index][key]
    })
}

function saveDataset() {
    if (editedIndex.value === undefined) return

    const index = editedIndex.value

    payload.value.datasets[index] = { ...editedData.value }

    editedIndex.value = undefined
}
</script>
<template>
    <is-drawer v-model="drawer">
        <template #activator="{ on }">
            <is-btn text v-bind="on">
                <is-icon name="cog" />
            </is-btn>
        </template>

        <is-card v-if="editedIndex === undefined">
            <is-card-head class="text-t-primary">
                <is-card-title> Chart config </is-card-title>

                <is-btn class="ml-auto" text rounded @click="drawer = false">
                    <is-icon name="times" />
                </is-btn>
            </is-card-head>

            <is-card-content class="flex flex-wrap">
                <w-input v-model="payload.title" :label="$t('title')" class="mb-4" />

                <div class="mb-4 w-full">
                    <w-select
                        v-model="payload.type"
                        :label="$t('type')"
                        class="w-full"
                        :options="chartTypes"
                    />
                </div>
            </is-card-content>

            <is-list-item class="text-lines font-bold"> Datasets </is-list-item>

            <is-list-item
                v-for="(dataset, index) in payload.datasets"
                :key="index"
                class="text-t-primary"
                @click="editDataset(index)"
            >
                {{ dataset.label }}
            </is-list-item>

            <is-list-item v-if="!payload.datasets.length" class="text-t-primary text-xs text-lines">
                {{ $t('noEntity', [$t('dataset')]) }}
            </is-list-item>

            <is-list-item class="text-t-primary mb-4" @click="addDataset">
                {{ $t('addEntity', [$t('dataset')]) }}
            </is-list-item>

            <div class="mt-auto flex justify-end w-full px-4">
                <is-btn class="mr-4" color="danger">
                    {{ $t('cancel') }}
                </is-btn>

                <is-btn @click="save">
                    {{ $t('save') }}
                </is-btn>
            </div>
        </is-card>

        <is-card v-else>
            <is-card-head class="text-t-primary">
                <is-btn text rounded @click="editedIndex = undefined">
                    <is-icon name="arrow-left" />
                </is-btn>

                <is-card-title> Config dataset </is-card-title>
            </is-card-head>

            <is-card-content class="flex flex-wrap">
                <w-input v-model="editedData.label" :label="$t('label')" class="mb-4" />
            </is-card-content>

            <is-card-content class="flex flex-wrap">
                <w-input
                    v-model="editedData.colors"
                    :label="$t('color', 2)"
                    class="mb-4"
                    placeholder="#000,#eee"
                />
            </is-card-content>

            <is-list-item class="text-lines font-bold">
                {{ `${$t('itemRules')}` }}
            </is-list-item>

            <is-list-item
                v-for="(rule, index) in editedData.rules"
                :key="index"
                class="text-t-primary flex gap-x-4 items-center"
            >
                <div class="w-[130px]">
                    <w-select v-model="rule[0]" :options="rulesOptions" />
                </div>

                <div class="grow">
                    <w-input v-model="rule[1]" :placeholder="$t('value')" />
                </div>

                <is-btn
                    size="sm"
                    rounded
                    text
                    color="danger"
                    @click="editedData.rules.splice(index, 1)"
                >
                    <is-icon name="times" />
                </is-btn>
            </is-list-item>

            <is-list-item class="text-t-primary mb-4">
                <is-btn size="sm" @click="editedData.rules.push(['filter', ''])">
                    {{ $t('addEntity', [$t('rule')]) }}
                </is-btn>
            </is-list-item>

            <is-list-item class="text-lines font-bold">
                {{ `${$t('yAxisRules')}` }}
            </is-list-item>

            <is-list-item
                v-for="(rule, index) in editedData.yRules"
                :key="index"
                class="text-t-primary flex gap-x-4 items-center"
            >
                <div class="w-[130px]">
                    <w-select v-model="rule[0]" :options="rulesOptions" />
                </div>

                <div class="grow">
                    <w-input v-model="rule[1]" :placeholder="$t('value')" />
                </div>

                <is-btn
                    size="sm"
                    rounded
                    text
                    color="danger"
                    @click="editedData.yRules.splice(index, 1)"
                >
                    <is-icon name="times" />
                </is-btn>
            </is-list-item>

            <is-list-item class="text-t-primary mb-4">
                <is-btn size="sm" @click="editedData.yRules.push(['filter', ''])">
                    {{ $t('addEntity', [$t('rule')]) }}
                </is-btn>
            </is-list-item>

            <is-list-item class="text-lines font-bold">
                {{ `${$t('xAxisRules')}` }}
            </is-list-item>

            <is-list-item
                v-for="(rule, index) in editedData.xRules"
                :key="index"
                class="text-t-primary flex gap-x-4 items-center"
            >
                <div class="w-[130px]">
                    <w-select v-model="rule[0]" :options="rulesOptions" />
                </div>

                <div class="grow">
                    <w-input v-model="rule[1]" :placeholder="$t('value')" />
                </div>

                <is-btn
                    size="sm"
                    rounded
                    text
                    color="danger"
                    @click="editedData.xRules.splice(index, 1)"
                >
                    <is-icon name="times" />
                </is-btn>
            </is-list-item>

            <is-list-item class="text-t-primary mb-4">
                <is-btn size="sm" @click="editedData.xRules.push(['filter', ''])">
                    {{ $t('addEntity', [$t('rule')]) }}
                </is-btn>
            </is-list-item>

            <is-list-item v-if="!editedData.rules.length" class="text-t-primary text-xs text-lines">
                {{ $t('noEntity', [$t('rule', 2)]) }}
            </is-list-item>

            <div class="mt-auto flex justify-end w-full px-4 mb-4">
                <is-btn class="mr-4" color="danger" @click="editedIndex = undefined">
                    {{ $t('cancel') }}
                </is-btn>

                <is-btn @click="saveDataset">
                    {{ $t('save') }}
                </is-btn>
            </div>
        </is-card>
    </is-drawer>
</template>
