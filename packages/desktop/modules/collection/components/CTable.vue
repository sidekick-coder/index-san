<script setup lang="ts">
import { ref, watch, computed, resolveComponent } from 'vue'
import { useRouter } from 'vue-router'

import debounce from 'lodash/debounce'

import Item from '@core/entities/item'
import Collection, { CollectionColumn } from '@core/entities/collection'

import { useStore } from '../store'
import { useNonReactive } from '@/composables/utils'

import Draggable from 'vuedraggable'
import CColumn from './CColumn.vue'
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
        type: 'string',
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

// search items
const search = ref({
    input: '',
    show: false,
    onInput: debounce((v) => {
        search.value.input = v
    }, 100),
})

const filteredItems = computed(() =>
    items.value.filter((i) => {
        let valid = true

        if (search.value.input) {
            valid = !!JSON.stringify(i).includes(search.value.input)
        }

        return valid
    })
)
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
                <v-btn text size="sm" @click="drawers.filters = true">
                    <is-icon name="filter" />
                </v-btn>
            </div>
        </v-card-head>

        <v-table :items="filteredItems" :columns="column.columns">
            <template #column>
                <transition-group name="c">
                    <Draggable
                        key="dragggable"
                        v-model="column.columns"
                        handle=".drag"
                        item-key="id"
                        tag="v-tr"
                    >
                        >
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
                                    <v-btn
                                        size="sm"
                                        text
                                        class="text-t-secondary"
                                        @click="onColumnNew"
                                    >
                                        <is-icon name="plus" />
                                    </v-btn>
                                </v-th>
                            </template>
                        </template>
                    </Draggable>
                </transition-group>
                <!-- <v-tr class="relative">
                    <v-th
                        v-for="column in columns"
                        :key="column.name"
                        :style="column.width ? `width: ${column.width}px` : ''"
                    >
                        <c-column :collection-id="collectionId" :column="column" />

                        <is-resize-line v-model="column.width" :min-width="100" />
                    </v-th>

                    <v-th v-if="!columns.length">
                        <div
                            class="flex cursor-pointer text-t-secondary text-sm"
                            @click="onColumnNew"
                        >
                            Add column
                            <is-icon class="cursor-pointer ml-2" name="plus" @click="onColumnNew" />
                        </div>
                    </v-th>

                    <v-th v-else>
                        <v-btn size="sm" text class="text-t-secondary" @click="onColumnNew">
                            <is-icon name="plus" />
                        </v-btn>
                    </v-th>
                </v-tr> -->
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
