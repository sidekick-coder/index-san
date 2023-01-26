<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { onClickOutside, onKeyStroke } from '@vueuse/core'

import Draggable from 'vuedraggable'

import ViewTable from '@core/entities/view-table'
import Item from '@core/entities/item'

import { createBindings } from '@composables/binding'
import { useStore } from '@store/global'

import { createPayload } from '../composables/filter'
import { withOnlyView, withView } from '@modules/collection-column/composables/with-view'

import { withViewIterations } from '@modules/view/composables'
import { createViewIfNotExists, useView } from '@modules/view/composables/use-view'

import { useItemStore } from '@modules/item/store'

import CActions from './CActions.vue'
import CcColumn from '@modules/collection-column/components/CcColumn.vue'
import IValue from '@modules/item/components/IValue.vue'

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

// view

let view = useView<ViewTable>(props.collectionId, props.viewId, new ViewTable({}, props.viewId))

function setView() {
    view = useView<ViewTable>(props.collectionId, props.viewId, new ViewTable({}, props.viewId))
}

watch(
    () => props.viewId,
    async () => {
        if (props.viewId) {
            await createViewIfNotExists(
                props.collectionId,
                props.viewId,
                new ViewTable({}, props.viewId)
            )
        }
    },
    {
        immediate: true,
    }
)

watch([() => props.viewId, () => props.collectionId], setView)

// columns

const rawColumns = computed(() => store.column.all(props.collectionId))

if (!rawColumns.value.length) {
    store.column.set(props.collectionId)
}

const columns = computed({
    get() {
        const result: any[] = withView(rawColumns.value, view.value.columns)

        if (!result.length) {
            result.push({
                id: '_actions_no_columns',
                width: 200,
            })
        }

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
    columns.value = columns.value.map((c) => {
        if (c.id === id) {
            c.width = width
        }

        return c
    })
}

// items

let itemsStore = useItemStore(props.collectionId)

const items = computed(() => withViewIterations(itemsStore.items, view.value))

watch(
    () => props.collectionId,
    async (id) => {
        itemsStore = useItemStore(id)

        if (!itemsStore.items.length) {
            await itemsStore.load()
        }
    },
    { immediate: true }
)

// create item

async function create() {
    const item = new Item(createPayload(view.value?.filters, rawColumns.value))

    await itemsStore.create(item)
}

// actions

const actions = ref({
    menu: false,
    id: null as string | null,
    x: 0,
    y: 0,
})

function showActions(event: MouseEvent, id: string) {
    selected.value = [id]

    actions.value.x = event.clientX
    actions.value.y = event.clientY

    actions.value.id = id
    actions.value.menu = true
}

// selected
const table = ref(null)

const selected = ref<string[]>([])

onClickOutside(table, () => {
    selected.value = []
})

onKeyStroke('Escape', () => {
    selected.value = []
})

onKeyStroke('Delete', async () => {
    if (!selected.value.length) {
        return
    }

    for await (const id of selected.value) {
        await itemsStore.destroy(id)
    }

    selected.value = []
})
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
            data-test-id="table-wrapper"
            class="overflow-auto w-full"
            :class="!hideActions ? 'h-[calc(100%_-_53px)]' : 'h-full'"
        >
            <v-menu v-model="actions.menu" :x="actions.x" :y="actions.y" close-on-content-click>
                <v-card color="b-secondary">
                    <v-list-item
                        size="xs"
                        color="info"
                        dark
                        :to="`/collections/${collectionId}/items/${actions.id}`"
                    >
                        <v-icon name="eye" class="mr-2" />
                        {{ $t('viewEntity', [$t('item')]) }}
                    </v-list-item>

                    <v-list-item
                        size="xs"
                        color="danger"
                        dark
                        @click="itemsStore.destroy(actions.id!)"
                    >
                        <v-icon name="trash" class="mr-2" />
                        {{ $t('deleteEntity', [$t('item')]) }}
                    </v-list-item>
                </v-card>
            </v-menu>

            <v-table
                ref="table"
                v-model="selected"
                :items="items"
                :columns="columns"
                :limit="view.limit"
                item-key="id"
                v-bind="bindings.table"
            >
                <template #column="data">
                    <Draggable
                        v-model="data.columns"
                        handle=".drag"
                        item-key="id"
                        tag="tr"
                        :component-data="{ class: 'h-[41px]' }"
                    >
                        <template #item="{ element: c }">
                            <v-th v-if="c.id === 'select'" width="40"></v-th>

                            <v-th
                                v-else
                                v-show="!c.hide"
                                :id="c.id"
                                :width="c.width || 200"
                                :class="[c.id.startsWith('_') ? '!border-x-0 py-0 !px-2' : '']"
                            >
                                <v-btn
                                    v-if="c.id === '_actions_right'"
                                    size="sm"
                                    class="text-t-secondary"
                                    mode="text"
                                    @click="store.column.create(collectionId)"
                                >
                                    <v-icon name="plus" />
                                </v-btn>

                                <div
                                    v-else-if="c.id === '_actions_no_columns'"
                                    class="text-t-secondary text-sm"
                                    data-test-id="no-columns"
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
                                        :min-width="50"
                                        @update:model-value="(v) => resizeColumn(c.id, v)"
                                    />
                                </template>
                            </v-th>
                        </template>
                    </Draggable>
                </template>

                <template #item="data">
                    <v-tr
                        class="relative group/item"
                        :class="selected.includes(data.item.id) ? 'bg-accent/10' : ''"
                        height="41"
                        @contextmenu.prevent="showActions($event, data.item.id)"
                    >
                        <v-td
                            v-for="c in data.columns"
                            v-show="!c.hide"
                            :key="c.id"
                            :class="[
                                c.id.startsWith('_') ? '!border-x-0' : '',
                                selected.length ? 'select-none' : '',
                            ]"
                            no-padding
                            class="relative"
                        >
                            <v-btn
                                v-if="c.name === 'select'"
                                :class="
                                    selected.includes(data.item.id)
                                        ? 'text-accent opacity-100'
                                        : 'text-t-secondary'
                                "
                                class="mx-auto opacity-0 group-hover/item:opacity-100"
                                size="xs"
                                color="none"
                                mode="text"
                                v-bind="data['selectAttrs']"
                                @dblclick.stop="
                                    $router.push(
                                        `/collections/${collectionId}/items/${data.item.id}`
                                    )
                                "
                            >
                                <v-icon name="diamond" />
                            </v-btn>

                            <div
                                v-else-if="c.id === '_actions_right'"
                                class="h-[40px] w-full"
                                v-bind="data['selectAttrs']"
                                @dblclick.stop="
                                    $router.push(
                                        `/collections/${collectionId}/items/${data.item.id}`
                                    )
                                "
                            />

                            <div v-else-if="c.id === '_actions_no_columns'" class="py-2">-</div>

                            <i-value
                                v-else-if="!c.id.startsWith('_') && !c.hide"
                                :collection-id="collectionId"
                                :column-id="c.id"
                                :item-id="data.item.id"
                                :type="c.type"
                                size="none"
                                class="px-4 py-2"
                                select:no-chevron
                                menu:offset-y
                                input:color="none"
                                flat
                            />
                        </v-td>
                    </v-tr>
                </template>

                <template #append="data">
                    <v-tr class="cursor-pointer hover:bg-b-secondary" @click="create">
                        <v-td :colspan="data.columns.length" class="text-t-secondary text-sm">
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
