<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

import debounce from 'lodash/debounce'

import Item from '@core/entities/item'
import Collection, { CollectionColumn } from '@core/entities/collection'

import { useNonReactive } from '@/composables/utils'
import { useStore } from '@/modules/collection/store'
import { Filter, filter } from '@/modules/collection/composables/filter'

import Draggable from 'vuedraggable'
import CColumn from './CColumn.vue'
import CFilter from './CFilter.vue'
import IValue from '@/modules/item/components/IValue.vue'

const props = defineProps({
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

async function onItemNew() {
    // await createItem(props.workspaceId, props.collectionId)
}

async function onItemDelete(itemId: string) {
    // await deleteItem(props.workspaceId, props.collectionId, itemId)
}

async function onColumnNew() {
    // await createCollectionColumn(props.workspaceId, props.collectionId)
}

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

// set columns
interface CTableColumn extends CollectionColumn {
    width: number | string
}

const column = ref({
    loading: false,
    columns: [] as CTableColumn[],
})

async function setColumns() {
    column.value.columns = []

    if (!collection.value) {
        return
    }

    column.value.loading = true

    useNonReactive(collection.value.columns).forEach((c) => {
        column.value.columns.push({
            ...c,
            width: 200,
        })
    })

    column.value.columns.push({
        id: '_actions',
        field: '_actions',
        label: '',
        width: '100%',
        type: 'text',
    })

    column.value.loading = false
}

watch(collection, setColumns)

// set items
const items = ref<Item[]>([])

async function setItems() {
    if (!collection.value) {
        items.value = []
        return
    }
    store.item
        .list({ collectionId: props.collectionId })
        .then((r) => (items.value = r.data))
        .catch(() => (items.value = []))
}

watch(collection, setItems)

// search bar
const search = ref({
    input: '',
    show: false,
    onInput: debounce((v) => {
        search.value.input = v
    }, 100),
})

// filters
const filters = ref({
    drawer: false,
    payload: [] as Filter[],
    current: [] as Filter[],
})

const filteredItems = computed(() =>
    items.value.filter((i) => {
        let valid = filters.value.current.reduce((r, f) => r && filter(i, f), true)

        if (search.value.input) {
            valid = valid && !!JSON.stringify(i).includes(search.value.input)
        }

        return valid
    })
)

function addFilter(column: CollectionColumn) {
    filters.value.payload.push({
        column: column.id,
        type: column.type,
        config: {},
        value: '',
    })
}

function applyFilters() {
    filters.value.current = useNonReactive(filters.value.payload)

    filters.value.drawer = false
}

function cancelFilters() {
    filters.value.payload = useNonReactive(filters.value.current)

    filters.value.drawer = false
}
</script>

<template>
    <v-card class="group/card">
        <v-card-head>
            <v-card-title v-if="title" class="grow">
                {{ title }}
            </v-card-title>

            <div class="flex items-center opacity-0 group-hover/card:opacity-100 transition-all">
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

                <is-drawer v-model="filters.drawer">
                    <template #activator="{ attrs }">
                        <v-btn text size="sm" v-bind="attrs">
                            <is-icon name="filter" />
                        </v-btn>
                    </template>

                    <v-card-head class="px-4">
                        <v-card-title class="text-t-secondary mr-auto">
                            {{ $t('filter', 2) }}
                        </v-card-title>

                        <v-btn class="mr-4" color="danger" @click="cancelFilters">
                            {{ $t('cancel') }}
                        </v-btn>

                        <v-btn class="mr-4" @click="applyFilters">
                            {{ $t('apply') }}
                        </v-btn>

                        <v-btn @click="filters.drawer = false">
                            <is-icon name="times" />
                        </v-btn>
                    </v-card-head>

                    <c-filter
                        v-for="(f, index) in filters.payload"
                        :key="index"
                        :model-value="f"
                        :columns="collection ? collection.columns : []"
                        @update:model-value="(v) => (filters[index] = v)"
                        @destroy="filters.payload.splice(index, 1)"
                    />

                    <v-card-content class="flex-wrap">
                        <div v-if="!filters.payload.length" class="w-full mb-3 text-t-secondary">
                            {{ $t('noEntity', [$t('filter', 2)]) }}
                        </div>

                        <is-menu offset-y close-on-content-click>
                            <template #activator="{ on }">
                                <v-btn v-bind="on" class="mr-4" color="info">
                                    {{ $t('addEntity', [$t('filter')]) }}
                                </v-btn>
                            </template>

                            <v-card color="b-secondary">
                                <is-list-item
                                    v-for="c in collection ? collection.columns : []"
                                    :key="c.id"
                                    @click="addFilter(c)"
                                >
                                    {{ c.label }}
                                </is-list-item>
                            </v-card>
                        </is-menu>
                    </v-card-content>
                </is-drawer>
            </div>
        </v-card-head>

        <v-table :items="filteredItems" :columns="column.columns">
            <template #column>
                <Draggable v-model="column.columns" handle=".drag" item-key="id" tag="v-tr">
                    <template #item="{ element: c }">
                        <v-th
                            v-if="c.id !== '_actions'"
                            :style="c.width ? `width: ${c.width}px` : ''"
                        >
                            <c-column class="drag" :collection-id="collectionId" :column="c" />

                            <is-resize-line v-model="c.width" :min-width="100" />
                        </v-th>

                        <template v-else>
                            <v-th v-if="!column.columns.length" class="drag">
                                <div
                                    class="flex cursor-pointer text-t-secondary text-sm"
                                    @click="onColumnNew"
                                >
                                    Add column
                                    <is-icon
                                        class="cursor-pointer ml-2"
                                        name="plus"
                                        @click="onColumnNew"
                                    />
                                </div>
                            </v-th>

                            <v-th v-else class="w-full">
                                <v-btn size="sm" text class="text-t-secondary" @click="onColumnNew">
                                    <is-icon name="plus" />
                                </v-btn>
                            </v-th>
                        </template>
                    </template>
                </Draggable>
            </template>

            <template #item="{ item }">
                <v-tr class="relative group/item">
                    <v-td v-for="(c, index) in column.columns" :key="c.id" no-padding>
                        <is-menu v-if="index === 0" offset-y>
                            <template #activator="{ on }">
                                <v-btn
                                    class="w-9 -ml-9 h-9 absolute top-1 opacity-0 group-hover/item:opacity-100"
                                    text
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
                                    @click="onItemDelete(item.id)"
                                >
                                    <is-icon name="trash" class="mr-2" />
                                    {{ $t('deleteEntity', [$t('item')]) }}
                                </is-list-item>
                            </v-card>
                        </is-menu>

                        <i-value
                            v-if="c.id !== '_actions'"
                            :model-value="item[c.field]"
                            :column="c"
                            :item="item"
                        />
                    </v-td>
                </v-tr>
            </template>

            <template #append>
                <v-tr>
                    <v-td
                        :colspan="column.columns.length"
                        class="cursor-pointer hover:bg-b-secondary text-t-secondary text-sm border-r-0"
                        @click="onItemNew"
                    >
                        <fa-icon icon="plus" class="mr-2" />

                        <span>New</span>
                    </v-td>
                </v-tr>
            </template>
        </v-table>
    </v-card>
</template>
