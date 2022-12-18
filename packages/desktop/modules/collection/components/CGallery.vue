<script setup lang="ts">
import { debounce } from 'lodash'
import { computed, ref, useAttrs, watch } from 'vue'
import { useRouter } from 'vue-router'

import Collection from '@core/entities/collection'
import Column, { ColumnType } from '@core/entities/column'
import Item from '@core/entities/item'
import ViewGallery, { ViewGalleryColumn } from '@core/entities/view-gallery'

import { createBindings } from '@/composables/binding'
import { useNonReactive } from '@/composables/utils'
import { filter } from '../composables/filter'
import { useStore } from '../store'

// components
import CDrawerFilter from './CDrawerFilter.vue'
import CDrawerHideColumns from './CDrawerHideColumns.vue'
import IValue from '@/modules/item/components/IValue.vue'
import EImg from '@/modules/entry/components/EImg.vue'
import { useView } from '../composables/view'

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
    title: {
        type: String,
        default: null,
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

const { view, setView } = useView(new ViewGallery(), (payload) => {
    const data = useNonReactive(payload)

    data.columns = data.columns
        .filter((c) => !c.id.startsWith('_'))
        .map((c) => ({
            id: c.id,
            hide: c.hide,
        }))

    return data
})

watch(collection, () => setView(collection.value!, props.viewId), {
    deep: true,
})

// count visible columns

const visibleColumns = computed(() => view.value.columns.filter((c) => !c.hide).length)

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

// update item

const updateItem = debounce(async (item: Item, field: string, value: any) => {
    let old = useNonReactive(item)

    item[field] = value

    const payload = {
        collectionId: props.collectionId,
        itemId: old.id,
        data: {
            [field]: value,
        },
    }

    await store.item.update(payload).catch(() => {
        item[field] = old
    })
}, 1000)

// create item
async function createItem() {
    const payload = {}

    const safeList = [ColumnType.text, ColumnType.select, ColumnType.number, ColumnType.relation]

    view.value.filters.forEach((f) => {
        const column = view.value.columns.find((c) => c.id === f.columnId)

        if (!column || !column.type || !column.field) return

        if (safeList.includes(column.type)) {
            payload[column.field] = f.value
        }
    })

    const item = new Item(payload)

    items.value.push(item)

    await store.item.create({
        collectionId: props.collectionId,
        data: item,
    })
}
</script>

<template>
    <v-card width="100%">
        <v-card-head v-bind="bindings.head">
            <v-card-title v-if="title" class="grow">
                {{ title }}
            </v-card-title>

            <v-btn text size="sm" @click="setItems">
                <is-icon name="rotate" />
            </v-btn>

            <is-menu offset-y>
                <template #activator="{ on }">
                    <v-btn text size="sm" v-bind="on">
                        <is-icon name="cog" />
                    </v-btn>
                </template>

                <v-card color="b-secondary" width="300">
                    <v-card-content class="flex flex-wrap gap-y-4">
                        <is-select
                            v-model="view.thumbnail.key"
                            :options="view.columns"
                            label-key="label"
                            value-key="field"
                            :label="$t('thumbnail')"
                        />

                        <is-select
                            v-model="view.thumbnail.fit"
                            :options="['cover', 'contain', 'fill', 'none', 'scale-down']"
                            :label="$t('fit')"
                        />

                        <is-select
                            v-model="view.thumbnail.position"
                            :options="[
                                'top',
                                'bottom',
                                'center',
                                'left',
                                'right',

                                'left-top',
                                'left-bottom',
                                'right-top',
                                'right-bottom',
                            ]"
                            :label="$t('position')"
                        />

                        <div class="flex gap-x-4">
                            <is-input
                                v-model="view.sizes.sm.width"
                                :label="$t('widthEntity', ['sm'])"
                                class="max-w-[80px]"
                            />

                            <is-input
                                v-model="view.sizes.md.width"
                                :label="$t('widthEntity', ['md'])"
                                class="max-w-[80px]"
                            />

                            <is-input
                                v-model="view.sizes.lg.width"
                                :label="$t('widthEntity', ['lg'])"
                                class="max-w-[80px]"
                            />
                        </div>

                        <div class="flex gap-x-4">
                            <is-input
                                v-model="view.sizes.sm.height"
                                :label="$t('heightEntity', ['sm'])"
                                class="max-w-[80px]"
                            />

                            <is-input
                                v-model="view.sizes.md.height"
                                :label="$t('heightEntity', ['md'])"
                                class="max-w-[80px]"
                            />

                            <is-input
                                v-model="view.sizes.lg.height"
                                :label="$t('heightEntity', ['lg'])"
                                class="max-w-[80px]"
                            />
                        </div>
                    </v-card-content>
                </v-card>
            </is-menu>

            <c-drawer-hide-columns v-model="view.columns" />
            <c-drawer-filter v-model="view.filters" :columns="collection?.columns" />
        </v-card-head>

        <div class="overflow-auto w-full h-[calc(100%_-_53px)]">
            <v-gallery
                :items="items"
                :columns="view.columns"
                v-bind="bindings.gallery"
                :loading="loadingItems"
                :sizes="view.sizes"
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
                            v-if="view.thumbnail.key"
                            :src="data.item[view.thumbnail.key]"
                            :height="`calc(100% - ${visibleColumns * 48}px)`"
                            :fit="view.thumbnail.fit"
                            :position="view.thumbnail.position"
                            width="100%"
                            class="object-cover"
                        />

                        <template v-for="(c, cIndex) in data.columns" :key="cIndex">
                            <is-list-item v-if="!c.hide" size="px-1 py-1">
                                <i-value
                                    :model-value="data.item[c.field]"
                                    :column="c"
                                    :item="data.item"
                                    class="w-full"
                                    @update:model-value="updateItem(data.item, c.field, $event)"
                                />
                            </is-list-item>
                        </template>
                    </v-card>
                </template>

                <template #append-body="data">
                    <v-card
                        :width="data.size.width"
                        :height="data.size.height"
                        class="rounded border border-lines flex items-center justify-center cursor-pointer"
                        v-bind="data.bindings.card"
                        @click="createItem"
                    >
                        <is-icon class="text-2xl text-lines" name="plus" />
                    </v-card>
                </template>
            </v-gallery>
        </div>
    </v-card>
</template>
