<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { ref, watch, computed, useAttrs } from 'vue'
import { useRouter } from 'vue-router'

import debounce from 'lodash/debounce'

import Column from '@core/entities/column'

import { useNonReactive } from '@/composables/utils'
import { createBindings } from '@/composables/binding'
import { useStore } from '@/modules/collection/store'

import Draggable from 'vuedraggable'
import CColumn from './CColumn.vue'
import CActions from './CActions.vue'

import IValue from '@/modules/item/components/IValue.vue'
import ViewTable from '@/../core/entities/view-table'

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

const view = computed(() => store.view.getView<ViewTable>(props.collectionId, innerViewId.value))

async function setViews() {
    innerViewId.value = props.viewId || ''

    await store.view.setViews(props.collectionId)

    if (!view.value) {
        const view = new ViewTable()

        innerViewId.value = view.id

        await store.view.createView(props.collectionId, view, !!props.viewId)
    }
}

watch(props, setViews, {
    immediate: true,
    deep: true,
})

// columns

const columns = computed({
    get() {
        const columns: any[] = useNonReactive(collection.value?.columns || [])

        useNonReactive(view.value.columns).forEach((c) => {
            const cColumn = columns.find((cv) => cv.id === c.id)

            Object.assign(cColumn || {}, c)
        })

        columns.sort((a, b) => {
            const aIndex = view.value.columns.findIndex((s) => s.id === a.id)
            const bIndex = view.value.columns.findIndex((s) => s.id === b.id)

            if (aIndex === -1 || bIndex === -1) return 0

            return aIndex - bIndex
        })

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

function resizeColumn(id: string, width: number) {
    const column = view.value.columns.find((c) => c.id === id)

    if (column) {
        column.width = width
        return
    }

    view.value.columns.push({ id, width })
}

// items

const items = computed(() => store.item.getRegister(props.collectionId).items)
const loading = computed(() => store.item.getRegister(props.collectionId).loading)

async function load() {
    await store.item.setRegister(props.collectionId)
}

watch(() => view.value.filters, debounce(load, 500), { deep: true, immediate: true })

// update item with debounce

const updateItem = debounce(store.item.update, 500)
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
            <v-table :items="items" :columns="columns" v-bind="bindings.table" :loading="loading">
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
                                    @click="store.createColumn(collectionId)"
                                >
                                    <is-icon name="plus" />
                                </v-btn>

                                <template v-else-if="!c.id.startsWith('_')">
                                    <c-column
                                        class="drag"
                                        :collection-id="collectionId"
                                        :model-value="c"
                                        :collection="collection!"
                                        @update:model-value="
                                            store.updateColumn($event, collectionId)
                                        "
                                        @destroy="store.deleteColumn(c, collectionId)"
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
                                        @click="store.item.destroy(collectionId, data.item)"
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
                                    updateItem(collectionId, data.item, c.field!, $event)
                                "
                            />
                        </v-td>
                    </v-tr>
                </template>

                <template #append>
                    <v-tr
                        class="cursor-pointer hover:bg-b-secondary"
                        @click="store.item.create(collectionId)"
                    >
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
