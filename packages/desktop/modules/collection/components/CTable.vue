<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { ref, watch, computed, useAttrs } from 'vue'
import { useRouter } from 'vue-router'

import debounce from 'lodash/debounce'

import Column from '@core/entities/column'

import { createBindings } from '@/composables/binding'
import { useStore } from '@/modules/collection/store'

import Draggable from 'vuedraggable'
import CcColumn from '@/modules/collection-column/components/CcColumn.vue'
import CActions from './CActions.vue'

import IValue from '@/modules/item/components/IValue.vue'
import ViewTable from '@/../core/entities/view-table'
import Item from '@/../core/entities/item'
import { createPayload, withViewFilters } from '../composables/filter'
import { withoutOnlyView, withView } from '@/modules/collection-column/composables/with-view'

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
    hideActions: {
        type: Boolean,
        default: false,
    },
})

// bindings
const attrs = useAttrs()

const bindings = computed(() => createBindings(attrs, ['table', 'head']))

// collection

const router = useRouter()
const store = useStore()

const collection = computed(() => store.collections.find((c) => c.id === props.collectionId))

async function setCollection() {
    if (!collection.value) {
        await store.setCollections()
    }

    if (!collection.value) {
        router.push('404')
    }
}

watch(() => props.collectionId, setCollection, {
    immediate: true,
})

// view
const innerViewId = ref('')

const view = computed(() => store.view.get<ViewTable>(props.collectionId, innerViewId.value))

async function setViews() {
    innerViewId.value = props.viewId || ''

    await store.view.setViews(props.collectionId)

    if (!view.value) {
        const view = new ViewTable()

        innerViewId.value = view.id

        await store.view.create(props.collectionId, view, !!props.viewId)
    }
}

watch(props, setViews, {
    immediate: true,
    deep: true,
})

// columns

watch(
    () => props.collectionId,
    (id) => store.column.set(id),
    { immediate: true }
)

const columns = computed({
    get() {
        const columns: any[] = withView(store.column.all(props.collectionId), view.value?.columns)

        // console.log(columns)

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
        if (!view.value) return

        view.value.columns = withoutOnlyView(value)
    },
})

function resizeColumn(id: string, width: number) {
    columns.value = columns.value.map((c) => {
        if (c.id === id) {
            c.width = width
        }

        return c
    })
}

// items

const items = computed(() => {
    if (view.value) {
        return withViewFilters(store.item.get(props.collectionId), view.value)
    }

    return store.item.get(props.collectionId)
})

const register = computed(() => store.item.getStoreItem(props.collectionId))

async function load() {
    await store.item.setItems(props.collectionId)
}

watch(() => view.value?.filters, debounce(load, 500), { deep: true, immediate: true })

// update item with debounce

const updateItem = debounce((item: Item, field: string, value: any) => {
    const old = item[field]

    item[field] = value

    store.item.update(props.collectionId, item.id, { [field]: value }).catch(() => {
        item[field] = old
    })
}, 500)

// create item

async function create() {
    const item = new Item(createPayload(view.value?.filters, collection.value?.columns))

    await store.item.create(props.collectionId, item)
}
</script>

<template>
    <v-card v-if="view" :height="height" :width="width" v-bind="bindings.root">
        <c-actions
            v-if="!hideActions"
            v-bind="bindings.head"
            :collection-id="props.collectionId"
            :view-id="viewId"
        />

        <div
            class="overflow-auto w-full"
            :class="!hideActions ? 'h-[calc(100%_-_53px)]' : 'h-full'"
        >
            <v-table
                :items="items"
                :columns="columns"
                v-bind="bindings.table"
                :loading="register?.loading"
            >
                <template #column>
                    <Draggable v-model="columns" handle=".drag" item-key="id" tag="v-tr">
                        <template #item="{ element: c }">
                            <v-th
                                v-show="!c.hide"
                                :id="c.id"
                                :width="c.width || 200"
                                :class="c.id.startsWith('_') ? '!border-x-0 !px-0' : ''"
                            >
                                <v-btn
                                    v-if="c.id === '_actions_right'"
                                    size="sm"
                                    text
                                    class="text-t-secondary mx-2"
                                    @click="store.column.create(collectionId)"
                                >
                                    <v-icon name="plus" />
                                </v-btn>

                                <template v-else-if="!c.id.startsWith('_')">
                                    <cc-column
                                        class="drag"
                                        :collection-id="collectionId"
                                        :column-id="c.id"
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
                            v-for="c in columns"
                            v-show="!c.hide"
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
                                        class="w-full h-[40px] opacity-0 group-hover/item:opacity-100"
                                        size="none"
                                        color="b-secondary"
                                        tile
                                        v-bind="on"
                                    >
                                        <v-icon name="ellipsis-vertical" />
                                    </v-btn>
                                </template>

                                <v-card color="b-primary">
                                    <v-list-item
                                        size="xs"
                                        color="danger"
                                        dark
                                        @click="store.item.destroy(collectionId, data.item.id)"
                                    >
                                        <v-icon name="trash" class="mr-2" />
                                        {{ $t('deleteEntity', [$t('item')]) }}
                                    </v-list-item>
                                </v-card>
                            </is-menu>

                            <div v-else-if="c.id === '_actions_right'"></div>

                            <i-value
                                v-else
                                :model-value="data.item[c.field as string]"
                                :column="(c as Column)"
                                :item="data.item"
                                @update:model-value="updateItem(data.item, c.field!, $event)"
                            />
                        </v-td>
                    </v-tr>
                </template>

                <template #append>
                    <v-tr class="cursor-pointer hover:bg-b-secondary" @click="create">
                        <v-td class="!border-x-0"></v-td>

                        <v-td
                            :colspan="collection?.columns.length"
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
