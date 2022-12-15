<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { ref, watch, computed, useAttrs } from 'vue'
import { useRouter } from 'vue-router'

import debounce from 'lodash/debounce'

import Item from '@core/entities/item'
import Collection from '@core/entities/collection'
import { ViewTable } from '@core/entities/view'

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

// view
const view = ref<ViewTable & { loading: boolean }>({
    loading: false,

    id: props.viewId,
    component: 'table',
    columns: [],
    filters: [],
})

async function setView() {
    if (!collection.value) return

    view.value.loading = true

    const columns: ViewTable['columns'] = []
    const savedColumns: ViewTable['columns'] = []

    if (props.viewId) {
        await store.view.show(props.collectionId, props.viewId).then((r: ViewTable) => {
            if (!r) return

            view.value.filters = r.filters

            savedColumns.push(...r.columns)
        })
    }

    columns.push({
        id: '_actions_left',
        field: '_actions_left',
        label: '',
        width: 26,
        type: 'text',
    })

    collection.value.columns
        .map((c) => useNonReactive(c))
        .forEach((c) =>
            columns.push({
                width: 5,
                ...c,
                ...savedColumns.find((s) => s.id === c.id),
            })
        )

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

    const data = useNonReactive(view.value)

    data.columns = data.columns.filter((c) => !c.id.startsWith('_'))

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
</script>

<template>
    <v-card class="group/card" :height="height" :width="width" v-bind="bindings.root">
        <v-card-head v-bind="bindings.head">
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
                                <v-btn size="sm" text class="text-t-secondary" @click="onColumnNew">
                                    <is-icon name="plus" />
                                </v-btn>
                            </v-th>

                            <v-th v-else :id="c.id" :width="c.width">
                                <c-column class="drag" :collection-id="collectionId" :column="c" />

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
                            <is-menu v-if="c.id === '_actions_left'" offset-y>
                                <template #activator="{ on }">
                                    <v-btn
                                        class="opacity- 0 w-full h-[43px] opacity-0 group-hover/item:opacity-100"
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
                                        @click="onItemDelete(data.item.id)"
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
                            />
                        </v-td>
                    </v-tr>
                </template>

                <template #append>
                    <v-tr>
                        <v-td
                            :colspan="view.columns.length"
                            class="cursor-pointer hover:bg-b-secondary text-t-secondary text-sm border-r-0"
                            @click="onItemNew"
                        >
                            <fa-icon icon="plus" class="mr-2" />

                            <span>New</span>
                        </v-td>
                    </v-tr>
                </template>
            </v-table>
        </div>
    </v-card>
</template>
