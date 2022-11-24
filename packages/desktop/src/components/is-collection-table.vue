<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import debounce from 'lodash/debounce'

import {
    createCollectionColumn,
    useCollectionColumns,
    useCollectionItems,
    useCollectionViews,
    updateOrCreateCollectionView,
} from '@/composables/collection'
import { createItem, deleteItem } from '@/composables/item'
import { useArray, ArrayFilter } from '@/composables/array'

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
})

const router = useRouter()
const drawers = ref({
    filters: false,
    columns: false,
})

const loading = ref(false)

const [columns, setColumns] = useCollectionColumns()
const [items, setItems] = useCollectionItems()
const [views, setViews] = useCollectionViews()

const options = ref<Record<string, any>>({})

const filteredColumns = computed(() => {
    const formatted = columns.value.map((column) => ({
        ...column,
        hide: options.value[`column:${column.id}:hide`] || false,
        width: options.value[`column:${column.id}:width`] || 100,
    }))

    return formatted.filter((c) => !c.hide)
})

const filteredItems = computed(() => {
    const filters = columns.value
        .filter((c) => !!options.value[`filter:${c.field}`])
        .map<ArrayFilter>((c) => ({
            type: c.type === 'relation' ? 'string' : c.type,
            key: c.field,
            value: options.value[`filter:${c.field}`],
        }))

    return useArray(items.value)
        .filter(...filters)
        .value()
})

const filters = computed(() => {
    const result = {}

    Object.keys(options.value)
        .filter((key) => key.startsWith('filter:'))
        .forEach((key) => {
            result[key.replace('filter:', '')] = options.value[key]
        })

    return result
})

const hiddenColumns = computed(() => {
    const result: string[] = []

    columns.value.forEach((column) => {
        if (options.value[`column:${column.id}:hide`]) {
            result.push(column.id)
        }
    })

    return result
})

async function load() {
    loading.value = true

    await setViews(props.workspaceId, props.collectionId)
    await setColumns(props.workspaceId, props.collectionId)
    await setItems(props.workspaceId, props.collectionId)

    const view = views.value.find((v) => v.id === props.viewId)

    if (view) {
        Object.keys(view).forEach((key) => {
            options.value[key] = view[key]
        })
    }

    setTimeout(() => (loading.value = false), 500)
}

async function onItemNew() {
    await createItem(props.workspaceId, props.collectionId)
}

async function onItemShow(item: any) {
    router.push({
        query: {
            showItem: 'true',
            itemId: item.id,
            workspaceId: props.workspaceId,
            collectionId: props.collectionId,
        },
    })
}

async function onItemDelete(itemId: string) {
    await deleteItem(props.workspaceId, props.collectionId, itemId)
}

async function onColumnNew() {
    await createCollectionColumn(props.workspaceId, props.collectionId)
}

const saveOptions = debounce(async () => {
    if (loading.value || !props.viewId) return

    await updateOrCreateCollectionView(
        props.workspaceId,
        props.collectionId,
        props.viewId,
        options.value
    )
}, 1000)

function setFilters(value: any) {
    Object.keys(value).forEach((key) => {
        options.value[`filter:${key}`] = value[key]
    })
}

function setHiddenColumns(value: string[]) {
    columns.value.forEach((column) => {
        options.value[`column:${column.id}:hide`] = value.includes(column.id)
    })
}

watch(options, saveOptions, { deep: true })
watch(props, load, { immediate: true, deep: true })
</script>

<template>
    <is-card>
        <is-collection-table-filters
            v-model="drawers.filters"
            :columns="columns"
            :filters="filters"
            @submit="setFilters"
        />

        <is-collection-table-columns
            v-model="drawers.columns"
            :columns="columns"
            :hidden-columns="hiddenColumns"
            @submit="setHiddenColumns"
        />

        <is-card-head>
            <is-card-title v-if="title">
                {{ title }}
            </is-card-title>

            <div class="ml-auto">
                <is-btn text @click="drawers.columns = true">
                    <is-icon name="table-columns" />
                </is-btn>

                <is-btn text @click="drawers.filters = true">
                    <is-icon name="filter" />
                </is-btn>
            </div>
        </is-card-head>

        <is-table
            v-if="!loading"
            :items="filteredItems"
            :columns="filteredColumns"
            class="collection-table"
        >
            <template #column="data">
                <tr :class="data.classes.tr" class="relative">
                    <th
                        v-for="(column, index) in data.columns"
                        :key="column.name"
                        :class="data.classes.th"
                        :style="column.width ? `width: ${column.width}px` : ''"
                    >
                        <is-collection-column
                            :workspace-id="workspaceId"
                            :collection-id="collectionId"
                            :column="column"
                        />

                        <is-icon
                            v-if="index === data.columns.length - 1"
                            class="absolute cursor-pointer -mr-[36px] w-[36px] text-gray-500 flex items-center justify-center h-full right-0 top-0"
                            name="plus"
                            @click="onColumnNew"
                        />

                        <is-resize-line
                            :model-value="column.width"
                            :min-width="100"
                            @update:model-value="(value: number) => options[`column:${column.id}:width`] = value"
                        />
                    </th>

                    <th v-if="!columns.length" :class="data.classes.th">
                        <div class="flex cursor-pointer" @click="onColumnNew">
                            Add column
                            <is-icon class="cursor-pointer ml-2" name="plus" @click="onColumnNew" />
                        </div>
                    </th>
                </tr>
            </template>

            <template #item="{ item, classes }">
                <tr :class="classes.tr" class="collection-table-item">
                    <td
                        v-for="(c, index) in filteredColumns"
                        :key="c.id"
                        :class="classes.td"
                        class="relative"
                    >
                        <is-icon
                            v-if="index === 0"
                            class="absolute text-gray-500 cursor-pointer w-[36px] -ml-[36px] flex items-center justify-center h-full top-0 actions"
                            name="ellipsis-vertical"
                            @click="onItemShow(item)"
                        />

                        <is-collection-column-value
                            :workspace-id="workspaceId"
                            :collection-id="collectionId"
                            :item-id="item.id"
                            :column="c"
                            :item="item"
                        />

                        <i
                            v-if="index === filteredColumns.length - 1"
                            class="absolute text-gray-500 cursor-pointer -mr-[36px] h-full flex items-center justify-center actions right-0 top-0"
                            @click="onItemDelete(item.id)"
                        >
                            <fa-icon icon="trash" />
                        </i>
                    </td>
                </tr>
            </template>

            <template #append-body="{ classes }">
                <tr :class="classes.tr">
                    <td
                        :class="[classes.td]"
                        :colspan="filteredColumns.length + 2"
                        class="p-2 cursor-pointer hover:bg-gray-800 text-gray-500 text-sm border-r-0"
                        @click="onItemNew"
                    >
                        <fa-icon icon="plus" class="mr-2" />

                        <span>New</span>
                    </td>
                </tr>
            </template>
        </is-table>
    </is-card>
</template>
