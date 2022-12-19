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

const view = computed(
    () => store.view.getRegister<ViewGallery>(props.collectionId, props.viewId).view
)

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

        return columns
    },
    set(value) {
        view.value.columns = value.filter((c) => !c.id.startsWith('_'))
    },
})

// count visible columns

const visibleColumns = computed(() => view.value.columns.filter((c) => !c.hide).length)

// items

const items = computed(() => store.item.getRegister(props.collectionId).items)

const loading = computed(() => store.item.getRegister(props.collectionId).loading)

async function load() {
    await store.item.setRegister(props.collectionId, {
        filters: view.value.filters,
    })
}

watch(() => view.value?.filters, debounce(load, 500), { deep: true })

// update item with debounce

const updateItem = debounce(store.item.update, 500)
</script>

<template>
    <v-card width="100%">
        <c-actions v-bind="bindings.head" :collection-id="props.collectionId" :view-id="viewId" />

        <!-- <v-card-head v-bind="bindings.head">
            <v-card-title v-if="title" class="grow">
                {{ title }}
            </v-card-title>

            <v-btn text size="sm" @click="load">
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
        </v-card-head> -->

        <div class="overflow-auto w-full h-[calc(100%_-_53px)]">
            <v-gallery
                :items="items"
                :columns="columns"
                v-bind="bindings.gallery"
                :loading="loading"
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
                                    @update:model-value="
                                        updateItem(collectionId, data.item, c.field, $event)
                                    "
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
                        @click="store.item.create"
                    >
                        <is-icon class="text-2xl text-lines" name="plus" />
                    </v-card>
                </template>
            </v-gallery>
        </div>
    </v-card>
</template>
