<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import debounce from 'lodash/debounce'

import ViewGroup from '@core/entities/view-group'

import { useAllViews } from '@/modules/view/composables/use-all-views'
import { useView } from '@/modules/view/composables/use-view'
import { AnyView } from '@/modules/view/store'
import { useStore } from '@/store/global'

import CActionsGallery from './CActionsGallery.vue'
import CActionsTable from './CActionsTable.vue'
import { vi } from 'vitest'

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

const { view, save, load } = useView<ViewGroup>({
    collectionId: props.collectionId,
    viewId: props.viewId,
    defaultValue: new ViewGroup({}, props.viewId),
})

watch([() => props.collectionId, () => props.viewId], () =>
    load({
        collectionId: props.collectionId,
        viewId: props.viewId,
    })
)

// watch(view, debounce(save, 500), { deep: true })

// set related views
const store = useStore()

const { views: all } = useAllViews(props.collectionId)

// toggle

async function toggle(id: string) {
    const index = view.value.viewIds.indexOf(id)

    if (index === -1) {
        view.value.viewIds.push(id)
    }

    if (index !== -1) {
        view.value.viewIds.splice(index, 1)
    }

    view.value.viewIds = view.value.viewIds.filter((id) => all.value.some((v) => v.id == id))

    await save()
}

async function destroy(id: string) {
    await store.view.destroy(props.collectionId, id)
}

// tabs

const tab = ref(0)

// selected view

const selected = computed(() => all.value.find((v) => v.id === view.value.selected))

function onSelect(id: string) {
    if (!view.value.viewIds.includes(id)) return

    view.value.selected = id
}
</script>
<template>
    <v-card color="b-secondary" width="350">
        <v-card-head>
            <v-btn
                :color="tab === 0 ? 'text-t-primary' : 'text-t-secondary'"
                class="hover:text-t-primary"
                size="h-[45px] text-sm w-full"
                @click="tab = 0"
                >{{ $t('config') }}</v-btn
            >
            <v-btn
                class="w-full hover:text-t-primary"
                size="h-[45px] text-sm w-full"
                :color="tab === 1 ? 'text-t-primary' : 'text-t-secondary'"
                tile
                @click="tab = 1"
                >{{ $t('view') }}</v-btn
            >
        </v-card-head>

        <v-card-content v-if="tab == 0">
            <template v-if="selected">
                <c-actions-table
                    v-if="selected.component === 'table'"
                    :collection-id="collectionId"
                    :view-id="view.selected"
                />

                <c-actions-gallery
                    v-else-if="selected.component === 'gallery'"
                    :collection-id="collectionId"
                    :view-id="view.selected"
                />
            </template>

            <v-list-item v-else class="justify-center">
                {{ $t('noEntity', [$t('config', 2)]) }}
            </v-list-item>
        </v-card-content>

        <v-card-content v-if="tab == 1" class="flex-wrap">
            <v-list-item
                v-for="v in all.filter((v) => v.component !== 'group')"
                :key="v.id"
                :class="view.selected == v.id ? '' : 'text-t-secondary'"
                @click="onSelect(v.id)"
            >
                <div class="mr-auto">
                    {{ v.label || v.id }}
                </div>

                <v-btn size="sm" color="b-primary" class="mr-2" @click="destroy(v.id)">
                    <v-icon name="trash" />
                </v-btn>

                <v-btn size="sm" color="b-primary" @click="toggle(v.id)">
                    <v-icon :name="view.viewIds.includes(v.id) ? 'minus' : 'plus'" />
                </v-btn>
            </v-list-item>

            <v-list-item
                v-if="!all.filter((v) => v.component !== 'group').length"
                class="justify-center"
            >
                {{ $t('noEntity', [$t('view', 2)]) }}
            </v-list-item>
        </v-card-content>
    </v-card>
</template>
