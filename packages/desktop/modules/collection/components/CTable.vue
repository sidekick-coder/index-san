<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { ref, watch, computed, useAttrs } from 'vue'

import debounce from 'lodash/debounce'

import Column from '@core/entities/column'

import { createBindings } from '@/composables/binding'
import { useStore } from '@/store/global'

import Draggable from 'vuedraggable'
import CcColumn from '@/modules/collection-column/components/CcColumn.vue'
import CActions from './CActions.vue'

import IValue from '@/modules/item/components/IValue.vue'
import ViewTable from '@/../core/entities/view-table'
import Item from '@/../core/entities/item'
import { createPayload, withViewFilters } from '../composables/filter'
import { withOnlyView, withView } from '@/modules/collection-column/composables/with-view'
import { useNonReactive } from '@/composables/utils'

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
const bindings = computed(() => createBindings(useAttrs(), ['table', 'head']))

// collection

const store = useStore()

const collection = computed(() => store.collection.get(props.collectionId))

// view
const innerViewId = ref('')

const view = computed({
    get: () => store.view.get<ViewTable>(props.collectionId, innerViewId.value),
    set: (value) => {
        if (!value) return

        store.view.set<ViewTable>(props.collectionId, innerViewId.value, value)
    },
})

async function setViews() {
    innerViewId.value = props.viewId || ''

    await store.view.setViews(props.collectionId)

    if (!view.value) {
        const view = new ViewTable({}, props.viewId)

        innerViewId.value = view.id

        await store.view.create(props.collectionId, view, !!props.viewId)
    }
}

watch(props, setViews, {
    immediate: true,
    deep: true,
})

// columns

const columns = computed({
    get() {
        const columns: any[] = withView(store.column.all(props.collectionId), view.value?.columns)

        if (!columns.length) {
            columns.push({
                id: '_actions_no_columns',
                width: 200,
            })
        }

        columns.unshift({
            id: '_actions_left',
            label: '#',
            width: 43,
        })

        columns.push({
            id: '_actions_right',
            width: '100%',
        })

        return columns
    },
    set(value) {
        if (!view.value) return

        view.value = {
            ...view.value,
            columns: withOnlyView(value).filter((c) => !c.id.startsWith('_')),
        }
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

watch(
    () => props.collectionId,
    (id) => store.column.set(id),
    { immediate: true }
)

// items

const items = computed(() => {
    if (view.value) {
        return withViewFilters(store.item.all(props.collectionId), view.value)
    }

    return store.item.all(props.collectionId)
})

const register = computed(() => store.item.getStoreItem(props.collectionId))

async function load() {
    await store.item.setItems(props.collectionId)
}

watch(() => view.value?.filters, debounce(load, 500), { deep: true, immediate: true })

// update item with debounce

const updateItem = debounce((item: Item, field: string, value: any) => {
    const old = useNonReactive(item)

    item[field] = value

    store.item.update(props.collectionId, old.id, { [field]: value }).catch(() => {
        item[field] = old[field]
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
                        <template #item="{ element: c, index }">
                            <v-th
                                v-show="!c.hide"
                                :id="c.id"
                                :width="c.width || 200"
                                :class="[
                                    c.id.startsWith('_') ? '!border-x-0 py-0 !px-2' : '',
                                    index === 1 ? '!pl-0' : '',
                                ]"
                            >
                                <v-btn
                                    v-if="c.id === '_actions_right'"
                                    size="h-8 w-8 text-xs"
                                    class="text-t-secondary"
                                    rounded
                                    text
                                    @click="store.column.create(collectionId)"
                                >
                                    <v-icon name="plus" />
                                </v-btn>

                                <div
                                    v-else-if="c.id === '_actions_no_columns'"
                                    class="text-t-secondary text-sm"
                                >
                                    {{
                                        store.column.isLoading(collectionId)
                                            ? $t('loading')
                                            : $t('noEntity', [$t('column', 2)])
                                    }}
                                </div>

                                <template v-else-if="!c.id.startsWith('_')">
                                    <cc-column
                                        class="drag"
                                        :collection-id="collectionId"
                                        :column-id="c.id"
                                    />

                                    <v-resize-line
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
                            v-for="(c, cIndex) in columns"
                            v-show="!c.hide"
                            :key="c.id"
                            no-padding
                            :class="[c.id.startsWith('_') ? '!border-x-0' : '']"
                            class="relative"
                        >
                            <div
                                v-if="c.id === '_actions_left'"
                                class="flex justify-center opacity-0 group-hover/item:opacity-100"
                            >
                                <v-menu offset-y close-on-content-click>
                                    <template #activator="{ attrs }">
                                        <v-btn
                                            size="h-8 w-8 text-xs"
                                            class="text-t-secondary"
                                            rounded
                                            text
                                            v-bind="attrs"
                                        >
                                            <v-icon name="ellipsis-vertical" />
                                        </v-btn>
                                    </template>

                                    <v-card color="b-secondary">
                                        <v-list-item
                                            size="xs"
                                            color="info"
                                            dark
                                            :to="`/collections/${collectionId}/items/${data.item.id}`"
                                        >
                                            <v-icon name="eye" class="mr-2" />
                                            {{ $t('viewEntity', [$t('item')]) }}
                                        </v-list-item>

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
                                </v-menu>
                            </div>

                            <div v-else-if="c.id === '_actions_no_columns'" class="py-2">-</div>

                            <i-value
                                v-else-if="!c.id.startsWith('_')"
                                :model-value="data.item[c.field as string]"
                                :column="(c as Column)"
                                :item="data.item"
                                :size="cIndex === 1 ? 'none' : 'md'"
                                select:no-chevron
                                color="none"
                                flat
                                menu:offset-y
                                @update:model-value="updateItem(data.item, c.field!, $event)"
                            />

                            <v-btn
                                v-if="cIndex === 1"
                                size="h-8 w-8 text-xs"
                                rounded
                                text
                                class="absolute right-2 top-1 text-t-secondary opacity-0 group-hover/item:opacity-100"
                                :to="`/collections/${collectionId}/items/${data.item.id}`"
                            >
                                <v-icon name="eye" />
                            </v-btn>
                        </v-td>
                    </v-tr>
                </template>

                <template #pagination="{ pagination, limit, visibleLength }">
                    <v-tr
                        v-if="items.length > pagination.limit"
                        class="cursor-pointer hover:bg-b-secondary"
                        @click="pagination.limit = pagination.limit + Number(limit)"
                    >
                        <v-td class="!border-x-0"></v-td>

                        <v-td
                            :colspan="collection?.columns.length"
                            class="!border-x-0 !px-0 text-t-secondary text-sm"
                        >
                            <fa-icon icon="arrow-down" class="mr-2" />

                            <span>{{
                                `${$t('loadMore')} (${visibleLength}/${items.length})`
                            }}</span>
                        </v-td>
                    </v-tr>
                </template>

                <template #append>
                    <v-tr class="cursor-pointer hover:bg-b-secondary" @click="create">
                        <v-td class="!border-x-0"></v-td>

                        <v-td
                            :colspan="collection?.columns.length"
                            class="!border-x-0 !px-0 text-t-secondary text-sm"
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
