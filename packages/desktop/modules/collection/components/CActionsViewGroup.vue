<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import ViewGroup from '@core/entities/view-group'

import { useView } from '@modules/view/composables/use-view'
import { useViewStore } from '@modules/view/store'

import CActionsGallery from './CActionsGallery.vue'
import CActionsTable from './CActionsTable.vue'
import { useState } from '@composables/state'
import { useI18n } from 'vue-i18n'

// Props & emit
const props = defineProps({
    collectionId: {
        type: String,
        required: true,
    },
    viewId: {
        type: String,
        default: '',
    },
})

// view
let store = useViewStore(props.collectionId)
let view = useView<ViewGroup>(props.collectionId, props.viewId, new ViewGroup({}, props.viewId))
let selectedView = useState(`view:${props.collectionId}:${props.viewId}:selected`, '', {
    localStorage: true,
})

function setView() {
    store = useViewStore(props.collectionId)

    selectedView = useState(`view:${props.collectionId}:${props.viewId}:selected`, '', {
        localStorage: true,
    })

    view = useView<ViewGroup>(props.collectionId, props.viewId, new ViewGroup({}, props.viewId))
}

watch([() => props.viewId, () => props.collectionId], setView, { immediate: true })

// toggle

async function toggle(id: string) {
    const index = view.value.viewIds.indexOf(id)

    if (index === -1) {
        view.value.viewIds.push(id)
    }

    if (index !== -1) {
        view.value.viewIds.splice(index, 1)
    }

    view.value.viewIds = view.value.viewIds.filter((id) => store.views.some((v) => v.id == id))
}

async function destroy(id: string) {
    store.destroy(id)
}

// tabs

const tab = ref(0)

// selected view

const selected = computed(() => store.views.find((v) => v.id === selectedView.value))

function onSelect(id: string) {
    if (!view.value.viewIds.includes(id)) return

    selectedView.value = id
}

// label

const tm = useI18n()

function getLabel(id: string) {
    const search = store.views.find((v) => v.id === id)

    if (search?.label) return search.label

    if (search?.component === 'table') return tm.t('table')

    if (search?.component === 'gallery') return tm.t('gallery')

    return tm.t('view')
}
</script>
<template>
    <v-card color="b-secondary" width="350">
        <v-card-head>
            <v-btn mode="text" @click="tab = 0">{{ $t('config') }}</v-btn>
            <v-btn mode="text" tile @click="tab = 1">{{ $t('view') }}</v-btn>
        </v-card-head>

        <v-card-content v-if="tab == 0">
            <template v-if="selected">
                <c-actions-table
                    v-if="selected.component === 'table'"
                    :collection-id="collectionId"
                    :view-id="selectedView"
                />

                <c-actions-gallery
                    v-else-if="selected.component === 'gallery'"
                    :collection-id="collectionId"
                    :view-id="selectedView"
                />
            </template>

            <v-list-item v-else class="justify-center">
                {{ $t('noEntity', [$t('config', 2)]) }}
            </v-list-item>
        </v-card-content>

        <v-card-content v-if="tab == 1" class="flex-wrap">
            <v-list-item
                v-for="v in store.views.filter((v) => v.component !== 'group')"
                :key="v.id"
                :class="selectedView == v.id ? '' : 'text-t-secondary'"
                @click="onSelect(v.id)"
            >
                <div class="mr-auto">
                    {{ getLabel(v.id) }}
                </div>

                <v-btn size="sm" color="b-primary" class="mr-2" @click="destroy(v.id)">
                    <v-icon name="trash" />
                </v-btn>

                <v-btn size="sm" color="b-primary" @click="toggle(v.id)">
                    <v-icon :name="view.viewIds.includes(v.id) ? 'minus' : 'plus'" />
                </v-btn>
            </v-list-item>

            <v-list-item
                v-if="!store.views.filter((v) => v.component !== 'group').length"
                class="justify-center"
            >
                {{ $t('noEntity', [$t('view', 2)]) }}
            </v-list-item>
        </v-card-content>
    </v-card>
</template>
