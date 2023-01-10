<script setup lang="ts">
import { computed, onUnmounted, ref, useAttrs, watch } from 'vue'
import { useRouter } from 'vue-router'

import ViewGallery from '@core/entities/view-gallery'

import { createBindings } from '@/composables/binding'
import { useStore } from '@/store/global'

import Item from '@/../core/entities/item'

import CActions from './CActions.vue'
import IValue from '@/modules/item/components/IValue.vue'
import EImg from '@/modules/entry/components/EImg.vue'

import { createPayload } from '../composables/filter'
import { withView } from '@/modules/collection-column/composables/with-view'
import { useView } from '@/modules/view/composables/use-view'
import { useHooks, Events } from '@/plugins/hooks'
import { useItemStore } from '@/modules/item/store'
import { withViewIterations } from '@/modules/view/composables'

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

// view

let view = useView<ViewGallery>(props.collectionId, props.viewId, new ViewGallery({}, props.viewId))

function setView() {
    view = useView<ViewGallery>(props.collectionId, props.viewId, new ViewGallery({}, props.viewId))
}

watch([() => props.viewId, () => props.collectionId], setView, { immediate: true })

// columns
const store = useStore()

const collection = store.collection.get(props.collectionId)

const columns = computed(() => withView(collection?.columns || [], view.value?.columns))

// count visible columns

const visibleColumns = computed(() => view.value.columns.filter((c) => !c.hide).length)

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

// thumbnail
const hooks = useHooks()

const thumbnails = ref(new Map<string, InstanceType<typeof EImg>>())

function onItemUpdated({ collectionId, itemId, payload }: Events['item:updated']) {
    if (collectionId !== props.collectionId) return

    const key = view.value.thumbnail.key

    if (!key) return

    const src = payload[key]

    if (!src) return

    const eImg = thumbnails.value.get(itemId)

    if (eImg) {
        eImg.setSrc(src, true)
    }
}

hooks.on('item:updated', onItemUpdated)

onUnmounted(() => hooks.off('item:updated', onItemUpdated))

// create item

async function create() {
    const item = new Item(createPayload(view.value?.filters, collection?.columns))

    await itemsStore.create(item)
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
                :sizes="view.sizes"
                :limit="view.limit"
                item-key="id"
                class="py-4"
                v-bind="bindings.gallery"
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
                                size="sm"
                                color="b-secondary"
                                class="mr-2"
                                :to="`/collections/${collectionId}/items/${data.item.id}`"
                            >
                                <v-icon name="eye" />
                            </v-btn>
                            <v-menu offset-y close-on-content-click>
                                <template #activator="{ attrs }">
                                    <v-btn size="sm" color="b-secondary" v-bind="attrs">
                                        <v-icon name="ellipsis-vertical" />
                                    </v-btn>
                                </template>

                                <v-card color="b-secondary">
                                    <v-list-item
                                        size="xs"
                                        color="danger"
                                        dark
                                        @click="itemsStore.destroy(data.item.id)"
                                    >
                                        <v-icon name="trash" class="mr-2" />
                                        {{ $t('deleteEntity', [$t('item')]) }}
                                    </v-list-item>
                                </v-card>
                            </v-menu>
                        </div>

                        <e-img
                            v-if="view.thumbnail.key"
                            :ref="(el: any) => thumbnails.set(data.item.id, el)"
                            :src="data.item[view.thumbnail.key]"
                            :height="`calc(100% - ${visibleColumns * 48}px)`"
                            :fit="view.thumbnail.fit"
                            :position="view.thumbnail.position"
                            width="100%"
                            card:color="bg-b-primary/25"
                            class="min-h-[20%]"
                        />

                        <template v-for="c in data.columns" :key="`${c.id}-${data.item.id}`">
                            <v-list-item
                                v-if="!c.hide"
                                size="h-[48px]"
                                color="none"
                                class="hover:bg-b-primary/25"
                                @click.stop
                            >
                                <i-value
                                    :collection-id="collectionId"
                                    :column-id="c.id"
                                    :item-id="data.item.id"
                                    :type="c.type"
                                    :placeholder="c.label"
                                    card:color="b-primary"
                                    select:no-chevron
                                    menu:offset-y
                                    color="none"
                                    size="none"
                                    class="px-4 py-3 text-sm"
                                    flat
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
