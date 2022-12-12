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

        <v-card-head>
            <v-card-title v-if="title">
                {{ title }}
            </v-card-title>

            <div class="ml-auto flex">
                <v-btn text size="sm" @click="onColumnNew">
                    {{ $t('addEntity', [$t('column')]) }}
                </v-btn>

                <is-drawer>
                    <template #activator="{ on }">
                        <v-btn text size="sm" v-bind="on">
                            <is-icon name="table-columns" />
                        </v-btn>
                    </template>
                </is-drawer>

                <v-btn text size="sm" @click="drawers.filters = true">
                    <is-icon name="filter" />
                </v-btn>
            </div>
        </v-card-head>

        <is-table
            v-if="!loading"
            :items="filteredItems"
            :columns="filteredColumns"
            class="collection-table"
        >
            <template #column="data">
                <tr :class="data.classes.tr" class="relative">
                    <th
                        v-for="column in data.columns"
                        :key="column.name"
                        :class="data.classes.th"
                        :style="column.width ? `width: ${column.width}px` : ''"
                    >
                        <is-collection-column
                            :workspace-id="workspaceId"
                            :collection-id="collectionId"
                            :column="column"
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
                    <td v-for="(c, index) in filteredColumns" :key="c.id" :class="classes.td">
                        <is-menu v-if="index === 0" offset-y>
                            <template #activator="{ on }">
                                <v-btn
                                    class="w-[36px] -ml-[36px] absolute h-full top-0"
                                    text
                                    v-bind="on"
                                >
                                    <is-icon
                                        v-if="index === 0"
                                        class="text-lines cursor-pointer flex items-center justify-center actions"
                                        name="ellipsis-vertical"
                                    />
                                </v-btn>
                            </template>

                            <v-card color="b-primary">
                                <is-list-item
                                    size="xs"
                                    color="danger"
                                    dark
                                    @click="onItemDelete(item.id)"
                                >
                                    <is-icon name="trash" class="mr-2" />
                                    {{ $t('deleteEntity', [$t('item')]) }}
                                </is-list-item>
                            </v-card>
                        </is-menu>

                        <is-collection-column-value
                            :workspace-id="workspaceId"
                            :collection-id="collectionId"
                            :item-id="item.id"
                            :column="c"
                            :item="item"
                        />
                    </td>
                </tr>
            </template>

            <template #append-body="{ classes }">
                <tr :class="classes.tr">
                    <td
                        :class="[classes.td]"
                        :colspan="filteredColumns.length + 2"
                        class="p-2 cursor-pointer hover:bg-b-secondary text-t-secondary text-sm border-r-0"
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

<style lang="scss">
.collection-table {
    .collection-table-item {
        position: relative;
        .actions {
            opacity: 0;
        }

        &:hover {
            .actions {
                opacity: 1;
            }
        }
    }
}
</style>
