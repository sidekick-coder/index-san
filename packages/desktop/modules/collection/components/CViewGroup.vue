<script setup lang="ts">
import { ref, computed, useAttrs, watch, defineAsyncComponent } from 'vue'
import VDraggable from 'vuedraggable'

import ViewGroup from '@core/entities/view-group'
import ViewTable from '@core/entities/view-table'
import ViewGallery from '@core/entities/view-gallery'

import { createViewStore } from '@modules/view/store'
import { useView } from '@modules/view/composables/use-view'
import { createBindings } from '@composables/binding'
import { useState } from '@composables/state'

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

// view
const loading = ref(true)

let store = createViewStore(props.collectionId)

let view = useView<ViewGroup>(props.collectionId, props.viewId, new ViewGroup({}, props.viewId))

let selectedView = useState(`view:${props.collectionId}:${props.viewId}:selected`, '', {
    localStorage: true,
})

async function setView() {
    loading.value = true

    store = createViewStore(props.collectionId)

    selectedView = useState(`view:${props.collectionId}:${props.viewId}:selected`, '', {
        localStorage: true,
    })

    if (!store.views.length) {
        await store.load()
    }

    if (props.viewId && !store.views.some((v) => v.id === props.viewId)) {
        store.views.push(new ViewGroup({}, props.viewId))
    }

    view = useView<ViewGroup>(props.collectionId, props.viewId, new ViewGroup({}, props.viewId))

    loading.value = false
}

watch([() => props.viewId, () => props.collectionId], setView, { immediate: true })

async function seleteView(id: string) {
    if (!view.value) return

    selectedView.value = id
}

function isActive(id: string) {
    if (!view.value) return

    return selectedView.value === id
}

function getLabel(id: string) {
    const search = store.views.find((v) => v.id === id)

    return search ? search.label : id
}

// add new view

const options = {
    table: ViewTable,
    gallery: ViewGallery,
}

function addView(type: keyof typeof options, payload: any = {}) {
    const entity = new options[type](payload)

    entity.label = 'New view'

    store.views.push(entity)

    view.value.viewIds.push(entity.id)

    selectedView.value = entity.id
}

// delete

async function deleteView(id: string) {
    store.destroy(id)

    seleteView(view.value.viewIds[0])
}

// menu

function showMenu(id: string, handler: () => void) {
    if (isActive(id)) {
        return handler()
    }

    seleteView(id)
}

// duplicate view

async function duplicate(id: string) {
    const view = store.views.find((v) => v.id === id)

    if (!view) return

    let type: keyof typeof options = 'table'

    if (view.component === 'gallery') {
        type = 'gallery'
    }

    addView(type, view)
}

function getIcon(id: string) {
    const view = store.views.find((v) => v.id === id)

    if (view?.component === 'gallery') {
        return 'grip'
    }

    return 'table'
}

function isTable(id: string) {
    const view = store.views.find((v) => v.id === id)

    return view?.component === 'table'
}
</script>
<template>
    <v-card v-if="!loading" v-bind="bindings.root">
        <c-actions v-bind="bindings.head" :collection-id="collectionId" :view-id="selectedView">
            <template #left>
                <div class="flex">
                    <v-draggable
                        v-model="view.viewIds"
                        item-key="id"
                        handle=".drag"
                        :component-data="{ class: 'flex w-full' }"
                    >
                        <template #item="{ element: id, index }">
                            <div>
                                <v-menu offset-y :open-on-click="false" close-on-content-click>
                                    <template #activator="{ attrs, toggle }">
                                        <v-btn
                                            v-bind="attrs"
                                            mode="text"
                                            class="drag overflow-hidden whitespace-pre"
                                            :class="[
                                                isActive(id) ? '' : 'text-t-secondary',
                                                index === 0 ? '-ml-4' : '',
                                            ]"
                                            @click="showMenu(id, toggle)"
                                        >
                                            <v-icon :name="getIcon(id)" class="mr-2" />

                                            {{ getLabel(id) }}
                                        </v-btn>
                                    </template>

                                    <v-card color="b-secondary">
                                        <v-list-item size="sm" @click="duplicate(id)">
                                            <v-icon name="clone" class="mr-4" />
                                            {{ $t('duplicateEntity', ['view']) }}
                                        </v-list-item>

                                        <v-list-item size="sm" @click="deleteView(id)">
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
                                mode="text"
                                :class="!view.viewIds.length ? 'min-w-[150px]' : ''"
                                class="text-t-secondary overflow-hidden whitespace-pre"
                                v-bind="attrs"
                            >
                                <template v-if="!view.viewIds.length">
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
            <transition-group name="fade">
                <template v-for="id in view.viewIds" :key="id">
                    <c-table
                        v-if="isTable(id) && id === selectedView"
                        :collection-id="collectionId"
                        :view-id="id"
                        v-bind="bindings.table"
                        height="100%"
                        hide-actions
                    />

                    <c-gallery
                        v-else-if="id === selectedView"
                        :collection-id="collectionId"
                        :view-id="id"
                        v-bind="bindings.gallery"
                        hide-actions
                    />
                </template>
            </transition-group>

            <div v-if="!view.viewIds.length" class="h-full w-full flex items-center justify-center">
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
