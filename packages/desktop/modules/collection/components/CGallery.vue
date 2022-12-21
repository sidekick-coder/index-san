<script setup lang="ts">
import { debounce } from 'lodash'
import { computed, ref, useAttrs, watch } from 'vue'
import { useRouter } from 'vue-router'

import Collection from '@core/entities/collection'
import ViewGallery from '@core/entities/view-gallery'

import { createBindings } from '@/composables/binding'
import { useNonReactive } from '@/composables/utils'
import { useStore } from '../store'

// components
import CActions from './CActions.vue'

import IValue from '@/modules/item/components/IValue.vue'
import EImg from '@/modules/entry/components/EImg.vue'
import { createPayload, withViewFilters } from '../composables/filter'
import Item from '@/../core/entities/item'
import { withoutOnlyView, withView } from '@/modules/collection-column/composables/with-view'

// Props & Emits
const props = defineProps({
    collectionId: {
        type: String,
        required: true,
    },
    viewId: {
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

const bindings = computed(() => createBindings(attrs, ['card', 'head', 'gallery']))

// set collection
const store = useStore()
const router = useRouter()

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
const innerViewId = ref('')

const view = computed(() => store.view.getView<ViewGallery>(props.collectionId, innerViewId.value))

async function setViews() {
    innerViewId.value = props.viewId || ''

    await store.view.setViews(props.collectionId)

    if (!view.value) {
        const view = new ViewGallery()

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
        return withView(store.column.all(props.collectionId), view.value?.columns)
    },
    set(value) {
        if (!view.value) return

        view.value.columns = withoutOnlyView(value)
    },
})

// thumbnail

const thumbnail = computed(() => {
    if (view.value.thumbnail) return view.value.thumbnail

    return {
        key: '',
        position: '',
        fit: '',
    }
})

// sizes

const sizes = computed(() => {
    if (view.value.sizes) return view.value.sizes

    return {
        sm: {
            width: 200,
            height: 'auto',
        },
        md: {
            width: 282,
            height: 'auto',
        },
        lg: {
            width: 200,
            height: 'auto',
        },
    }
})

// count visible columns

const visibleColumns = computed(() => view.value.columns.filter((c) => !c.hide).length)

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

watch(() => view.value.filters, debounce(load, 500), { deep: true, immediate: true })

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
    const item = new Item(createPayload(view.value.filters, collection.value?.columns))

    await store.item.create(props.collectionId, item)
}
</script>

<template>
    <v-card v-if="view" width="100%">
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
            <v-gallery
                :items="items"
                :columns="columns"
                v-bind="bindings.gallery"
                :loading="register?.loading"
                :sizes="sizes"
                item-key="id"
                class="py-4"
            >
                <template #item="data">
                    <v-card
                        :width="data.size.width"
                        :height="data.size.height"
                        class="overflow-auto rounded"
                        :color="data.color"
                        v-bind="data.bindings.card"
                    >
                        <e-img
                            v-if="thumbnail.key"
                            :src="data.item[thumbnail.key]"
                            :height="`calc(100% - ${visibleColumns * 48}px)`"
                            :fit="thumbnail.fit"
                            :position="thumbnail.position"
                            width="100%"
                            card:color="bg-b-primary/25"
                        />

                        <template v-for="c in data.columns" :key="`${c.id}-${data.item.id}`">
                            <v-list-item
                                v-if="!c.hide"
                                :id="`${c.id}-${data.item.id}`"
                                size="px-1 py-1"
                            >
                                <i-value
                                    :model-value="data.item[c.field]"
                                    :column="c"
                                    :item="data.item"
                                    flat
                                    @update:model-value="updateItem(data.item, c.field, $event)"
                                />
                            </v-list-item>
                        </template>
                    </v-card>
                </template>

                <template #append-body="data">
                    <v-card
                        :width="!items.length ? '100%' : data.size.width"
                        :height="!items.length ? '100' : data.size.height"
                        class="rounded border border-lines flex items-center justify-center cursor-pointer"
                        v-bind="data.bindings.card"
                        @click="create"
                    >
                        <v-icon class="text-2xl text-lines" name="plus" />
                    </v-card>
                </template>
            </v-gallery>
        </div>
    </v-card>
</template>
