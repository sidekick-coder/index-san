<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { ref, watch, computed, useAttrs } from 'vue'
import { useRouter } from 'vue-router'
import uuid from 'uuid-random'

import debounce from 'lodash/debounce'

import Item from '@core/entities/item'
import Column, { ColumnType } from '@core/entities/column'
import Collection from '@core/entities/collection'
import ViewTable from '@core/entities/view-table'

import { useNonReactive } from '@/composables/utils'
import { filter } from '@/modules/collection/composables/filter'
import { createBindings } from '@/composables/binding'
import { useStore } from '@/modules/collection/store'

import Draggable from 'vuedraggable'
import CColumn from './CColumn.vue'
import CDrawerFilter from './CDrawerFilter.vue'
import IValue from '@/modules/item/components/IValue.vue'
import { useView } from '../composables/view'

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

// bindings
const attrs = useAttrs()

const bindings = computed(() => createBindings(attrs, ['table', 'head']))

// set collection
const router = useRouter()

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

const { view, setView } = useView(new ViewTable(), (payload) => {
    const data = useNonReactive(payload)

    data.columns = data.columns
        .filter((c) => !c.id.startsWith('_'))
        .map((c) => ({
            id: c.id,
            width: c.width,
        }))

    return data
})

watch(collection, () => setView(collection.value!, props.viewId), {
    deep: true,
})

// columns

const columnsWithActions = computed({
    get() {
        const columns = useNonReactive(view.value.columns)

        columns.unshift({
            id: '_actions_left',
            width: 26,
        })

        columns.push({
            id: '_actions_right',
            width: '100%',
        })

        return columns
    },
    set(value) {
        view.value.columns = value.filter((c) => !c.id.startsWith('_'))
    },
})

// resize
function resizeColumn(id: string, value: number) {
    const column = view.value.columns.find((c) => c.id === id)

    if (!column) return

    column.width = value
}

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

// create column
async function createColumn() {
    if (!collection.value) return

    const oldColumns = useNonReactive(collection.value.columns)

    const newColumns = useNonReactive(oldColumns)

    newColumns.push(new Column({ label: 'New' }))

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
}

// update column
async function updateColumn(column: Column) {
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
}

// delete column
async function deleteColumn(column: Column) {
    if (!collection.value) return

    const oldColumns = useNonReactive(collection.value.columns)

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
}

// create item
async function onItemNew() {
    const payload = {}

    const safeList = [ColumnType.text, ColumnType.select, ColumnType.number, ColumnType.relation]

    view.value.filters.forEach((f) => {
        const column = view.value.columns.find((c) => c.id === f.columnId)

        if (!column || !column.type || !column.field) return

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
                :columns="columnsWithActions"
                v-bind="bindings.table"
                :loading="loadingItems"
            >
                <template #column>
                    <Draggable v-model="columnsWithActions" handle=".drag" item-key="id" tag="v-tr">
                        <template #item="{ element: c }">
                            <v-th
                                :id="c.id"
                                :width="c.width || 200"
                                :class="c.id.startsWith('_') ? '!border-x-0 !px-0' : ''"
                            >
                                <v-btn
                                    v-if="c.id === '_actions_right'"
                                    size="sm"
                                    text
                                    class="text-t-secondary mx-2"
                                    @click="createColumn"
                                >
                                    <is-icon name="plus" />
                                </v-btn>

                                <template v-else-if="!c.id.startsWith('_')">
                                    <c-column
                                        class="drag"
                                        :collection-id="collectionId"
                                        :model-value="c"
                                        :collection="(collection as Collection)"
                                        @update:model-value="updateColumn"
                                        @destroy="deleteColumn(c)"
                                    />

                                    <is-resize-line
                                        :model-value="c.width || 200"
                                        :min-width="100"
                                        @update:model-value="(v: number) => resizeColumn(c.id, v)"
                                    />
                                </template>
                            </v-th>
                        </template>
                    </Draggable>
                </template>

                <template #item="data">
                    <v-tr class="relative group/item">
                        <v-td
                            v-for="c in columnsWithActions"
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
                                :model-value="data.item[c.field as string]"
                                :column="(c as Column)"
                                :item="data.item"
                                @update:model-value="
                                    updateItem(data.item, c.field as string, $event)
                                "
                            />
                        </v-td>
                    </v-tr>
                </template>

                <template #append>
                    <v-tr class="cursor-pointer hover:bg-b-secondary" @click="onItemNew">
                        <v-td class="!border-x-0"></v-td>

                        <v-td
                            :colspan="columnsWithActions.length - 2"
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
