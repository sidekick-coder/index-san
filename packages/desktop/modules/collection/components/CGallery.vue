<script setup lang="ts">
import { debounce } from 'lodash'
import { computed, ref, useAttrs, watch } from 'vue'
import { useRouter } from 'vue-router'

import ViewGallery from '@core/entities/view-gallery'

import { createBindings } from '@/composables/binding'
import { useStore } from '@/store/global'

// components
import CActions from './CActions.vue'

import IValue from '@/modules/item/components/IValue.vue'
import EImg from '@/modules/entry/components/EImg.vue'
import { createPayload, withViewFilters } from '../composables/filter'
import Item from '@/../core/entities/item'
import { withOnlyView, withView } from '@/modules/collection-column/composables/with-view'
import { useNonReactive } from '@/composables/utils'

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
const bindings = computed(() => createBindings(useAttrs(), ['card', 'head', 'gallery']))

// set collection
const store = useStore()

const collection = computed(() => store.collection.get(props.collectionId))

// view
const innerViewId = ref('')

const view = computed(() => store.view.get<ViewGallery>(props.collectionId, innerViewId.value))

async function setViews() {
    innerViewId.value = props.viewId || ''

    await store.view.setViews(props.collectionId)

    if (!view.value) {
        const view = new ViewGallery({}, props.viewId)

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

        view.value.columns = withOnlyView(value)
    },
})

// thumbnail

const thumbnail = computed(() => {
    if (view.value?.thumbnail) return view.value.thumbnail

    return {
        key: '',
        position: '',
        fit: '',
    }
})

// sizes

const sizes = computed(() => {
    if (view.value?.sizes) return view.value.sizes

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

const visibleColumns = computed(() =>
    !view.value ? columns.value.length : view.value?.columns.filter((c) => !c.hide).length
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

const thumbnails = ref(new Map<string, InstanceType<typeof EImg>>())

function reloadThumbnail(itemId: string) {
    const eImg = thumbnails.value.get(itemId)

    if (eImg) {
        eImg.setSrc()
    }
}

// update item with debounce

const updateItem = debounce(async (item: Item, field: string, value: any) => {
    const old = useNonReactive(item)

    item[field] = value

    if (field === thumbnail.value.key) {
        reloadThumbnail(item.id)
    }

    await store.item.update(props.collectionId, old.id, { [field]: value }).catch(() => {
        item[field] = old[field]
    })
}, 500)

// create item

async function create() {
    const item = new Item(createPayload(view.value?.filters, collection.value?.columns))

    await store.item.create(props.collectionId, item)
}

// on item click
const router = useRouter()

function onClick(item: Item) {
    router.push(`/collections/${props.collectionId}/items/${item.id}`)
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
                        class="overflow-auto rounded cursor-pointer relative group/item"
                        :color="data.color"
                        v-bind="data.bindings.card"
                        tabindex="0"
                        @click="onClick(data.item)"
                    >
                        <div
                            class="absolute right-0 top-0 transition-opacity opacity-0 flex group-hover/item:opacity-100 px-2 py-2 rounded"
                            @click.stop
                        >
                            <v-btn
                                size="h-8 w-8 text-xs mr-2"
                                rounded
                                color="info"
                                :to="`/collections/${collectionId}/items/${data.item.id}`"
                            >
                                <v-icon name="eye" />
                            </v-btn>
                            <v-menu offset-y close-on-content-click>
                                <template #activator="{ attrs }">
                                    <v-btn
                                        size="h-8 w-8 text-xs"
                                        color="info"
                                        rounded
                                        v-bind="attrs"
                                    >
                                        <v-icon name="ellipsis-vertical" />
                                    </v-btn>
                                </template>

                                <v-card color="b-secondary">
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

                        <e-img
                            v-if="thumbnail.key"
                            :ref="(el: any) => thumbnails.set(data.item.id, el)"
                            :src="data.item[thumbnail.key]"
                            :height="`calc(100% - ${visibleColumns * 44}px)`"
                            :fit="thumbnail.fit"
                            :position="thumbnail.position"
                            width="100%"
                            card:color="bg-b-primary/25"
                            class="min-h-[20%]"
                        />

                        <template v-for="c in data.columns" :key="`${c.id}-${data.item.id}`">
                            <v-list-item
                                v-if="!c.hide"
                                :id="`${c.id}-${data.item.id}`"
                                size="none"
                                color="none"
                                class="hover:bg-b-primary/25"
                                @click.stop
                            >
                                <i-value
                                    :model-value="data.item[c.field]"
                                    :column="c"
                                    :item="data.item"
                                    :placeholder="c.label"
                                    card:color="b-primary"
                                    select:no-chevron
                                    menu:offset-y
                                    color="none"
                                    size="px-4 py-3 text-sm"
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
