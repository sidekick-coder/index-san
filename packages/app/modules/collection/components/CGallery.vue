<script setup lang="ts">
import { computed, onUnmounted, ref, useAttrs, watch } from 'vue'

import ViewGallery from '@index-san/core/entities/view-gallery'

import { createBindings } from '@composables/binding'
import { useStore } from '@store/global'

import Item from '@index-san/core/entities/item'

import CActions from './CActions.vue'
import IValue from '@modules/item/components/IValue.vue'
import EImg from '@modules/entry/components/EImg.vue'

import { createPayload } from '../composables/filter'
import { createViewIfNotExists, useView } from '@modules/view/composables/use-view'
import { useHooks, Events } from '@plugins/hooks'
import { useItemStore } from '@modules/item/store'
import { mergeWithViewColumns, withViewIterations } from '@modules/view/composables'
import { onClickOutside, onKeyStroke } from '@vueuse/core'

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

watch(
    () => props.viewId,
    async () => {
        if (props.viewId) {
            await createViewIfNotExists(
                props.collectionId,
                props.viewId,
                new ViewGallery({}, props.viewId)
            )
        }
    },
    {
        immediate: true,
    }
)

watch([() => props.viewId, () => props.collectionId], setView, { immediate: true })

// columns
const store = useStore()

const collection = store.collection.get(props.collectionId)

const columns = computed(() => mergeWithViewColumns(collection?.columns || [], view.value?.columns))

// count visible columns

const visibleColumns = computed(() => columns.value.filter((c) => !c.hide).length)

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

// actions

const actions = ref({
    menu: false,
    id: null as string | null,
    x: 0,
    y: 0,
})

function showActions(event: MouseEvent, id: string) {
    actions.value.x = event.clientX
    actions.value.y = event.clientY

    actions.value.id = id
    actions.value.menu = true
}

// selected

const gallery = ref(null)
const selected = ref<string[]>([])

onClickOutside(gallery, () => {
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
    <v-card v-if="view" width="100%">
        <c-actions
            v-if="!hideActions"
            v-bind="bindings.head"
            :collection-id="props.collectionId"
            :view-id="viewId"
        />

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

                <v-list-item size="xs" color="danger" dark @click="itemsStore.destroy(actions.id!)">
                    <v-icon name="trash" class="mr-2" />
                    {{ $t('deleteEntity', [$t('item')]) }}
                </v-list-item>
            </v-card>
        </v-menu>

        <div
            class="overflow-auto w-full"
            :class="!hideActions ? 'h-[calc(100%_-_53px)]' : 'h-full'"
        >
            <v-gallery
                ref="gallery"
                v-model="selected"
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
                        v-bind="data.bindings.card"
                        :width="data.size.width"
                        :height="data.size.height"
                        :color="data.color"
                        :class="[selected.includes(data.item.id) ? 'border-accent' : '']"
                        class="border border-transparent overflow-auto rounded cursor-pointer relative group/item outline-none focus:outline-none"
                        tabindex="0"
                        @contextmenu.prevent="showActions($event, data.item.id)"
                    >
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
                            @click="data.onClick"
                            @dblclick="
                                $router.push(`/collections/${collectionId}/items/${data.item.id}`)
                            "
                        />

                        <template
                            v-for="(c, cIndex) in data.columns.filter((c) => !c.hide)"
                            :key="`${c.id}-${data.item.id}`"
                        >
                            <v-list-item
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
                                    :checkbox:label="c.label"
                                    :class="cIndex === 0 ? 'max-w-[calc(100%_-_30px)]' : 'px-4'"
                                    class="px-4 py-3 text-sm"
                                    card:color="b-primary"
                                    select:no-chevron
                                    input:color="none"
                                    menu:offset-y
                                    size="none"
                                    flat
                                />

                                <v-btn
                                    v-if="cIndex === 0"
                                    size="none"
                                    mode="text"
                                    color="none"
                                    :class="
                                        selected.includes(data.item.id)
                                            ? 'text-accent opacity-100'
                                            : 'text-t-secondary'
                                    "
                                    class="ml-auto opacity-0 group-hover/item:opacity-100 text-xs pr-4"
                                    @click="data.onClick"
                                    @dblclick="
                                        $router.push(
                                            `/collections/${collectionId}/items/${data.item.id}`
                                        )
                                    "
                                >
                                    <v-icon name="diamond" />
                                </v-btn>
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
