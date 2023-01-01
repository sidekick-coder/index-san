<script setup lang="ts">
import ViewGroup from '@core/entities/view-group'

import { createBindings } from '@/composables/binding'
import { computed, useAttrs, watch, ref, defineAsyncComponent } from 'vue'
import { useStore } from '@/store/global'

import ViewTable from '@/../core/entities/view-table'
import ViewGallery from '@/../core/entities/view-gallery'

import VDraggable from 'vuedraggable'
import { useNonReactive } from '@/composables/utils'
import { useView } from '@/modules/view/composables/use-view'
import { debounce } from 'lodash'
import { useAllViews } from '@/modules/view/composables/use-all-views'

const CGallery = defineAsyncComponent(() => import('./CGallery.vue'))
const CTable = defineAsyncComponent(() => import('./CTable.vue'))
const CActions = defineAsyncComponent(() => import('./CActions.vue'))
const CActionsViewGroup = defineAsyncComponent(() => import('./CActionsViewGroup.vue'))

// Props & emit

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
const bindings = computed(() => createBindings(useAttrs(), ['head', 'table', 'gallery']))

// collection

const store = useStore()

// view

const { view, save } = useView<ViewGroup>({
    collectionId: props.collectionId,
    viewId: props.viewId,
    defaultValue: new ViewGroup({}, props.viewId),
    createIfNotExist: true,
})

// all views
const { views: all } = useAllViews(props.collectionId)

// selection

const group = computed(() => {
    const viewIds = view.value.viewIds

    const items = all.value.filter((v) => viewIds.includes(v.id))

    items.sort((a, b) => {
        const aIndex = viewIds.findIndex((id) => id === a.id)
        const bIndex = viewIds.findIndex((id) => id === b.id)

        if (aIndex === -1 || bIndex === -1) return 0

        return aIndex - bIndex
    })

    return items
})

async function reorder(value: any) {
    view.value.viewIds = value.map((v) => v.id)

    await save()
}

async function seleteView(id: string) {
    if (!view.value) return

    view.value.selected = id

    await save()
}

function isActive(id: string) {
    if (!view.value) return

    return view.value.selected === id
}

function getLabel(id: string) {
    const search = all.value.find((v) => v.id === id)

    return search ? search.label : id
}

// add new view

const options = {
    table: ViewTable,
    gallery: ViewGallery,
}

async function addView(type: keyof typeof options, payload: any = {}) {
    const entity = new options[type](payload)

    entity.label = 'New view'

    await store.view.create(props.collectionId, entity)

    view.value.selected = entity.id

    view.value.viewIds.push(entity.id)

    await save()
}

// delete

async function deleteView(id: string) {
    await store.view.destroy(props.collectionId, id)

    seleteView(group.value[0].id)

    await save()
}

// menu

function showMenu(id: string, handler: () => void) {
    if (isActive(id)) {
        return handler()
    }

    seleteView(id)
}

// duplicate view

async function duplicate(view: ViewTable | ViewGallery) {
    let type: keyof typeof options = 'table'

    if (view.component === 'gallery') {
        type = 'gallery'
    }

    await addView(type, view)
}
</script>
<template>
    <v-card v-if="view" v-bind="bindings.root">
        <c-actions v-bind="bindings.head" :collection-id="collectionId" :view-id="view.selected">
            <template #left>
                <div class="flex">
                    <v-draggable
                        v-if="group.length"
                        :model-value="group"
                        item-key="id"
                        handle=".drag"
                        :component-data="{ class: 'flex w-full' }"
                        @update:model-value="reorder"
                    >
                        <template #item="{ element: v, index }">
                            <div>
                                <v-menu offset-y :open-on-click="false" close-on-content-click>
                                    <template #activator="{ attrs, toggle }">
                                        <v-btn
                                            v-bind="attrs"
                                            text
                                            size="text-sm h-[45px]"
                                            tile
                                            color="hover:text-t-primary"
                                            class="drag overflow-hidden whitespace-pre"
                                            :class="[
                                                isActive(v.id)
                                                    ? 'text-t-primary'
                                                    : 'text-t-secondary',
                                                index === 0 ? 'pl-0 pr-4' : 'px-4',
                                            ]"
                                            @click="showMenu(v.id, toggle)"
                                        >
                                            <v-icon
                                                :name="v.component === 'table' ? 'table' : 'grip'"
                                                class="mr-2"
                                            />

                                            {{ getLabel(v.id) }}
                                        </v-btn>
                                    </template>

                                    <v-card color="b-secondary">
                                        <v-list-item size="sm" @click="duplicate(v)">
                                            <v-icon name="clone" class="mr-4" />
                                            {{ $t('duplicateEntity', ['view']) }}
                                        </v-list-item>

                                        <v-list-item size="sm" @click="deleteView(v.id)">
                                            <v-icon name="trash" class="mr-4" />

                                            {{ $t('deleteEntity', ['view']) }}
                                        </v-list-item>
                                    </v-card>
                                </v-menu>
                            </div>
                        </template>
                    </v-draggable>

                    <v-menu offset-y close-on-content-click>
                        <template #activator="{ attrs }">
                            <v-btn
                                text
                                size="text-sm px-4 h-[45px]"
                                tile
                                color="border-b border-transparent hover:bg-b-secondary/50 text-t-secondary overflow-hidden whitespace-pre"
                                :class="!group.length ? 'w-[150px]' : ''"
                                v-bind="attrs"
                            >
                                <template v-if="!group.length">
                                    <span class="mr-4">
                                        {{ $t('addEntity', [$t('view')]) }}
                                    </span>
                                </template>

                                <v-icon name="plus" />
                            </v-btn>
                        </template>

                        <v-card color="b-secondary">
                            <v-list-item @click="addView('table')">
                                {{ $t('addEntity', [$t('table')]) }}
                            </v-list-item>
                            <v-list-item @click="addView('gallery')">
                                {{ $t('addEntity', [$t('gallery')]) }}
                            </v-list-item>
                        </v-card>
                    </v-menu>
                </div>
            </template>

            <template #config-card>
                <c-actions-view-group :collection-id="collectionId" :view-id="view.id" />
            </template>
        </c-actions>

        <div class="overflow-auto w-full h-[calc(100%_-_45px)]">
            <template v-for="v in group" :key="v.id">
                <c-gallery
                    v-if="v.component === 'gallery' && v.id === view.selected"
                    :collection-id="collectionId"
                    :view-id="v.id"
                    v-bind="bindings.gallery"
                    hide-actions
                />

                <c-table
                    v-if="v.component === 'table' && v.id === view.selected"
                    :collection-id="collectionId"
                    :view-id="v.id"
                    v-bind="bindings.table"
                    height="100%"
                    hide-actions
                />
            </template>

            <div v-if="!group.length" class="h-full w-full flex items-center justify-center">
                <div class="text-center mb-2 text-t-secondary">
                    <v-icon name="box-open" class="text-2xl" />

                    <div class="block">
                        {{ $t('noEntity', [$t('view', 2)]) }}
                    </div>
                </div>
            </div>
        </div>
    </v-card>
</template>
