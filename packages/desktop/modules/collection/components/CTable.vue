<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { ref, watch, computed, useAttrs, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import debounce from 'lodash/debounce'

import Draggable from 'vuedraggable'

import ViewTable from '@core/entities/view-table'
import Item from '@core/entities/item'

import { createBindings } from '@/composables/binding'
import { useStore } from '@/store/global'

import { createPayload } from '../composables/filter'
import { withOnlyView, withView } from '@/modules/collection-column/composables/with-view'

import { withViewIterations } from '@/modules/view/composables'
import { useView } from '@/modules/view/composables/use-view'
import { Events, useHooks } from '@/plugins/hooks'

import { useItems } from '@/modules/item/composables/items'
import { createViewStore } from '@/modules/view/store'

const IValue = defineAsyncComponent(() => import('@/modules/item/components/IValue.vue'))
const CActions = defineAsyncComponent(() => import('./CActions.vue'))
const CcColumn = defineAsyncComponent(
    () => import('@/modules/collection-column/components/CcColumn.vue')
)

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

let view = useView<ViewTable>(props.collectionId, props.viewId, new ViewTable({}, props.viewId))

function setView() {
    view = useView<ViewTable>(props.collectionId, props.viewId, new ViewTable({}, props.viewId))
}

watch([() => props.viewId, () => props.collectionId], setView, { immediate: true })

// columns

const columns = computed({
    get() {
        const result: any[] = withView(collection.value?.columns || [], view.value.columns)

        if (!result.length) {
            result.push({
                id: '_actions_no_columns',
                width: 200,
            })
        }

        result.unshift({
            id: '_actions_left',
            label: '#',
            width: 43,
        })

        result.push({
            id: '_actions_right',
            width: '100%',
        })

        return result
    },
    set(value) {
        view.value.columns = withOnlyView(value)
    },
})

function resizeColumn(id: string, width: number) {
    const column = columns.value.find((c) => c.id === id)

    column.width = width
}

// items
const { items } = useItems(props.collectionId, view)

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
                :limit="view.limit"
                item-key="id"
                v-bind="bindings.table"
            >
                <template #column>
                    <Draggable
                        v-model="columns"
                        handle=".drag"
                        item-key="id"
                        tag="v-tr"
                        :component-data="{ height: 41 }"
                    >
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
                                        @update:model-value="(v) => resizeColumn(c.id, v)"
                                    />
                                </template>
                            </v-th>
                        </template>
                    </Draggable>
                </template>

                <template #item="data">
                    <v-tr class="relative group/item" height="41">
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
                                        <v-btn size="sm" color="b-secondary" v-bind="attrs">
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
                                v-else-if="!c.id.startsWith('_') && !c.hide"
                                :collection-id="collectionId"
                                :column-id="c.id"
                                :item-id="data.item.id"
                                :type="c.type"
                                :size="cIndex === 1 ? 'py-2' : 'md'"
                                select:no-chevron
                                menu:offset-y
                                color="none"
                                flat
                            />

                            <v-btn
                                v-if="cIndex === 1"
                                size="sm"
                                color="b-secondary"
                                class="absolute right-2 top-2 opacity-0 group-hover/item:opacity-100"
                                :to="`/collections/${collectionId}/items/${data.item.id}`"
                            >
                                <v-icon name="eye" />
                            </v-btn>
                        </v-td>
                    </v-tr>
                </template>

                <template #pagination="{ pagination, limit, length }">
                    <v-tr
                        v-if="items.length > limit"
                        class="cursor-pointer hover:bg-b-secondary"
                        @click="pagination.page++"
                    >
                        <v-td class="!border-x-0"></v-td>

                        <v-td
                            :colspan="collection?.columns.length"
                            class="!border-x-0 !px-0 text-t-secondary text-sm"
                        >
                            <fa-icon icon="arrow-down" class="mr-2" />

                            <span>{{ `${$t('loadMore')} (${length}/${items.length})` }}</span>
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
