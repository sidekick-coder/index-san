<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { ref, watch, computed, useAttrs } from 'vue'
import { useRouter } from 'vue-router'
import uuid from 'uuid-random'

import debounce from 'lodash/debounce'

import Item from '@core/entities/item'
import Collection, { CollectionColumn, CollectionColumnType } from '@core/entities/collection'
import { ViewTable, ViewTableColumn } from '@core/entities/view'

import { useNonReactive } from '@/composables/utils'
import { filter } from '@/modules/collection/composables/filter'
import { createBindings } from '@/composables/binding'
import { useStore } from '@/modules/collection/store'

import Draggable from 'vuedraggable'
import CColumn from './CColumn.vue'
import CDrawerFilter from './CDrawerFilter.vue'
import IValue from '@/modules/item/components/IValue.vue'

const props = defineProps({
    width: {
        type: [String, Number],
        default: '100%',
    },
    height: {
        type: [String, Number],
        default: null,
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

// set collection
const store = useStore()

const collection = ref<Collection>()

async function setCollection() {
    await store
        .show({ collectionId: props.collectionId })
        .then((r) => (collection.value = r.data))
        .catch(() => router.push('/404'))
}

watch(() => props.collectionId, setCollection, {
    immediate: true,
})

// view
const view = ref({
    loading: false,
    id: props.viewId,
    component: 'table' as ViewTable['component'],
    columns: [] as (CollectionColumn & ViewTableColumn)[],
    filters: [] as ViewTable['filters'],
})

async function setView() {
    if (!collection.value) return

    view.value.loading = true

    const columns: any[] = []
    const savedColumns: ViewTable['columns'] = []

    if (props.viewId) {
        await store.view.show(props.collectionId, props.viewId).then((r: ViewTable) => {
            if (!r) return

            view.value.filters = r.filters

            savedColumns.push(...r.columns)
        })
    }

    collection.value.columns
        .map((c) => useNonReactive(c))
        .forEach((c) =>
            columns.push({
                width: 200,
                ...c,
                ...savedColumns.find((s) => s.id === c.id),
            })
        )

    columns.sort((a, b) => {
        const aIndex = savedColumns.findIndex((s) => s.id === a.id)
        const bIndex = savedColumns.findIndex((s) => s.id === b.id)

        if (aIndex === -1 || bIndex === -1) return 0

        return aIndex - bIndex
    })

    columns.unshift({
        id: '_actions_left',
        field: '_actions_left',
        label: '',
        width: 26,
        type: 'text',
    })

    columns.push({
        id: '_actions_right',
        field: '_actions_right',
        label: '',
        width: '100%',
        type: 'text',
    })

    view.value.columns = columns

    setTimeout(() => (view.value.loading = false), 1100)
}

const saveView = debounce(async () => {
    if (!props.viewId || view.value.loading) return

    const data = useNonReactive<ViewTable>({
        id: view.value.id,
        component: view.value.component,
        columns: view.value.columns,
        filters: view.value.filters,
    })

    data.columns = data.columns
        .filter((c) => !c.id.startsWith('_'))
        .map((c) => ({
            id: c.id,
            width: c.width,
        }))

    await store.view.updateOrCreate({
        collectionId: props.collectionId,
        viewId: props.viewId,
        data,
    })
}, 1000)

watch(collection, setView)

watch(() => view.value.columns, saveView, { deep: true })
watch(() => view.value.filters, saveView, { deep: true })

// set items

const search = ref({
    input: '',
    show: false,
    onInput: debounce((v) => (search.value.input = v), 100),
})

const items = ref<Item[]>([])
const loadingItems = ref(false)

async function setItems() {
    if (!collection.value) {
        items.value = []
        return
    }

    if (loadingItems.value) return

    loadingItems.value = true

    const raw = await store.item
        .list({ collectionId: props.collectionId })
        .then((r) => (items.value = r.data))
        .catch(() => (items.value = []))

    items.value = raw.filter((i) => {
        let valid = !!JSON.stringify(i).toLowerCase().includes(search.value.input.toLowerCase())

        valid = view.value.filters.reduce((r, f) => r && filter(i, f), valid)

        return valid
    })

    setTimeout(() => (loadingItems.value = false), 800)
}

watch(collection, setItems)

watch(() => view.value.filters, debounce(setItems, 500), { deep: true })

watch(() => search.value.input, debounce(setItems, 1000))

// bindings
const attrs = useAttrs()

const bindings = computed(() => createBindings(attrs, ['table', 'head']))

// create column

async function createColumn() {
    if (!collection.value) return

    const oldColumns = useNonReactive(collection.value.columns).map((c) => ({
        ...c,
        width: undefined,
    }))

    const newColumns = useNonReactive(oldColumns)

    const id = uuid()

    newColumns.push({
        id,
        field: id,
        label: 'New',
        type: CollectionColumnType.text,
        width: undefined,
    })

    collection.value.columns = newColumns

    await store
        .update({
            collectionId: props.collectionId,
            data: {
                columns: newColumns,
            },
        })
        .catch(() => {
            collection.value!.columns = oldColumns
        })

    await setView()
}

// update column

async function updateColumn(column: CollectionColumn) {
    if (!collection.value) return

    const oldColumns = useNonReactive(collection.value.columns).map((c) => ({
        ...c,
        width: undefined,
    }))

    const newColumns = useNonReactive(oldColumns).map((c) => (c.id === column.id ? column : c))

    collection.value.columns = newColumns

    await store
        .update({
            collectionId: props.collectionId,
            data: {
                columns: newColumns,
            },
        })
        .catch(() => {
            collection.value!.columns = oldColumns
        })

    await setView()
}

// delete column

async function deleteColumn(column: CollectionColumn) {
    if (!collection.value) return

    const oldColumns = useNonReactive(collection.value.columns).map((c) => ({
        ...c,
        width: undefined,
    }))

    const newColumns = useNonReactive(oldColumns).filter((c) => c.id !== column.id)

    collection.value.columns = newColumns

    await store
        .update({
            collectionId: props.collectionId,
            data: {
                columns: newColumns,
            },
        })
        .catch(() => {
            collection.value!.columns = oldColumns
        })

    await setView()
}

// create item
async function onItemNew() {
    const payload = {}

    const safeList = [
        CollectionColumnType.text,
        CollectionColumnType.select,
        CollectionColumnType.number,
        CollectionColumnType.relation,
    ]

    view.value.filters.forEach((f) => {
        const column = view.value.columns.find((c) => c.id === f.columnId)

        if (!column) return

        if (safeList.includes(column.type)) {
            payload[column.field] = f.value
        }
    })

    const item = new Item(payload)

    items.value.push(item)

    await store.item.create({
        collectionId: props.collectionId,
        data: item,
    })
}

// update item

const updateItem = debounce(async (item: Item, field: string, value: any) => {
    let old = useNonReactive(item)

    item[field] = value

    const payload = {
        collectionId: props.collectionId,
        itemId: old.id,
        data: {
            [field]: value,
        },
    }

    await store.item.update(payload).catch(() => {
        item[field] = old
    })
}, 1000)

// delete item
async function onItemDelete(item: Item) {
    const index = items.value.indexOf(item)
    const old = useNonReactive(item)

    if (index === -1) return

    items.value.splice(index, 1)

    await store.item
        .destroy({
            collectionId: props.collectionId,
            itemId: item.id,
        })
        .catch(() => {
            items.value.push(old)
        })
}
</script>

<template>
    <v-card :height="height" :width="width" v-bind="bindings.root">
        <v-card-head v-bind="bindings.head">
            <v-card-title v-if="title" class="grow">
                {{ title }}
            </v-card-title>

            <div class="flex items-center transition-all">
                <transition name="slide-left">
                    <is-input
                        v-if="search.show || !!search.input"
                        :model-value="search.input"
                        :placeholder="$t('search')"
                        size="sm"
                        class="w-[300px] mr-2"
                        @update:model-value="search.onInput"
                    >
                        <template #append>
                            <v-btn
                                v-if="search.input"
                                text
                                size="none"
                                class="w-5 h-5"
                                @click="search.input = ''"
                            >
                                <is-icon name="times" />
                            </v-btn>
                        </template>
                    </is-input>
                </transition>

                <v-btn text size="sm" @click="search.show = !search.show">
                    <is-icon name="search" />
                </v-btn>

                <v-btn text size="sm" @click="setItems">
                    <is-icon name="rotate" />
                </v-btn>

                <c-drawer-filter v-model="view.filters" :columns="collection?.columns" />
            </div>
        </v-card-head>

        <div class="overflow-auto w-full h-[calc(100%_-_53px)]">
            <v-table
                :items="items"
                :columns="view.columns"
                v-bind="bindings.table"
                :loading="loadingItems"
            >
                <template #column>
                    <Draggable v-model="view.columns" handle=".drag" item-key="id" tag="v-tr">
                        <template #item="{ element: c }">
                            <v-th
                                v-if="c.id === '_actions_left'"
                                :id="c.id"
                                :width="c.width"
                                class="!border-x-0 !px-0"
                            />

                            <v-th
                                v-else-if="c.id === '_actions_right'"
                                :id="c.id"
                                class="w-full !border-x-0"
                                :width="c.width"
                            >
                                <v-btn
                                    size="sm"
                                    text
                                    class="text-t-secondary"
                                    @click="createColumn"
                                >
                                    <is-icon name="plus" />
                                </v-btn>
                            </v-th>

                            <v-th v-else :id="c.id" :width="c.width">
                                <c-column
                                    class="drag"
                                    :collection-id="collectionId"
                                    :model-value="c"
                                    :collection="(collection as Collection)"
                                    @update:model-value="updateColumn"
                                    @destroy="deleteColumn(c)"
                                />

                                <is-resize-line v-model="c.width" :min-width="100" />
                            </v-th>
                        </template>
                    </Draggable>
                </template>

                <template #item="data">
                    <v-tr class="relative group/item">
                        <v-td
                            v-for="c in view.columns"
                            :key="c.id"
                            no-padding
                            :class="c.id[0] === '_' ? '!border-x-0' : ''"
                        >
                            <is-menu
                                v-if="c.id === '_actions_left'"
                                offset-y
                                close-on-content-click
                            >
                                <template #activator="{ on }">
                                    <v-btn
                                        class="w-full h-[43px] opacity-0 group-hover/item:opacity-100"
                                        size="none"
                                        color="b-secondary"
                                        tile
                                        v-bind="on"
                                    >
                                        <is-icon name="ellipsis-vertical" />
                                    </v-btn>
                                </template>

                                <v-card color="b-primary">
                                    <is-list-item
                                        size="xs"
                                        color="danger"
                                        dark
                                        @click="onItemDelete(data.item)"
                                    >
                                        <is-icon name="trash" class="mr-2" />
                                        {{ $t('deleteEntity', [$t('item')]) }}
                                    </is-list-item>
                                </v-card>
                            </is-menu>

                            <div v-else-if="c.id === '_actions_right'"></div>

                            <i-value
                                v-else
                                :model-value="data.item[c.field]"
                                :column="c"
                                :item="data.item"
                                @update:model-value="updateItem(data.item, c.field, $event)"
                            />
                        </v-td>
                    </v-tr>
                </template>

                <template #append>
                    <v-tr class="cursor-pointer hover:bg-b-secondary" @click="onItemNew">
                        <v-td class="!border-x-0"></v-td>

                        <v-td
                            :colspan="view.columns.length - 2"
                            class="!border-x-0 !px-4 text-t-secondary text-sm"
                        >
                            <fa-icon icon="plus" class="mr-2" />

                            <span>New</span>
                        </v-td>

                        <v-td class="!border-x-0"></v-td>
                    </v-tr>
                </template>
            </v-table>
        </div>
    </v-card>
</template>
