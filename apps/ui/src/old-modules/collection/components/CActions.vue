<script setup lang="ts">
import ViewCommon from '@index-san/core/entities/view-common'

import { debounce } from 'lodash'
import { ref, computed, watch, defineAsyncComponent } from 'vue'

import View from '@index-san/core/entities/view'
import { useView } from '@modules/view/composables/use-view'

import CActionsColumns from './CActionsColumns.vue'
import CActionsOrder from './CActionsOrder.vue'
import CActionsFilters from './CActionsFilters.vue'
import { useItemStore } from '@modules/item/store'

const CActionsGallery = defineAsyncComponent(() => import('./CActionsGallery.vue') as any)
const CActionsTable = defineAsyncComponent(() => import('./CActionsTable.vue') as any)

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

let view = useView<ViewCommon>(props.collectionId, props.viewId, new ViewCommon({}, props.viewId))

function setView() {
    view = useView<ViewCommon>(props.collectionId, props.viewId, new ViewCommon({}, props.viewId))
}

watch([() => props.viewId, () => props.collectionId], setView, { immediate: true })

// search
const showInput = ref(false)

const input = computed({
    get() {
        return view.value?.search || ''
    },
    set: debounce((v: string) => {
        if (!view.value) return

        view.value.search = v
    }, 1000),
})

const menu = ref(false)

watch(
    () => props.viewId,
    () => {
        menu.value = false
    }
)

// refresh

// items

let itemsStore = useItemStore(props.collectionId)

watch(
    () => props.collectionId,
    async (id) => {
        itemsStore = useItemStore(id)

        await itemsStore.load()
    },
    { immediate: true }
)

async function refresh() {
    await itemsStore.load(true)
}

function isCommon(v: View): v is ViewCommon {
    return ['table', 'gallery'].includes(v.component)
}
</script>
<template>
    <v-card-head class="overflow-x-auto">
        <slot name="left" />

        <div class="grow" />

        <template v-if="isCommon(view)">
            <div class="flex items-center transition-all">
                <transition name="slide-left">
                    <v-input
                        v-if="showInput || !!input"
                        v-model="input"
                        :placeholder="$t('search')"
                        size="sm"
                        class="w-full max-w-[300px] mx-4"
                    >
                        <template #append>
                            <v-btn
                                v-if="input"
                                mode="text"
                                size="sm"
                                @click="input = ''"
                            >
                                <v-icon name="times" />
                            </v-btn>
                        </template>
                    </v-input>
                </transition>

                <v-btn
                    mode="text"
                    size="sm"
                    @click="showInput = !showInput"
                >
                    <v-icon name="search" />
                </v-btn>

                <v-btn
                    mode="text"
                    size="sm"
                    :loading="itemsStore.loading"
                    @click="refresh"
                >
                    <v-icon name="rotate" />
                </v-btn>

                <c-actions-order
                    :collection-id="collectionId"
                    :view-id="viewId"
                />

                <c-actions-filters
                    :collection-id="collectionId"
                    :view-id="viewId"
                />

                <c-actions-columns
                    :collection-id="collectionId"
                    :view-id="viewId"
                />
            </div>
        </template>

        <v-menu
            v-model="menu"
            offset-y
            offset-x
            :open-on-click="false"
        >
            <template #activator="{ attrs }">
                <div
                    class="h-[44px] flex items-center"
                    v-bind="attrs"
                >
                    <v-btn
                        mode="text"
                        size="sm"
                        @click="menu = !menu"
                    >
                        <v-icon name="cog" />
                    </v-btn>
                </div>
            </template>

            <slot
                v-if="menu"
                name="config-card"
            >
                <c-actions-gallery
                    v-if="view.component === 'gallery'"
                    :collection-id="collectionId"
                    :view-id="viewId"
                />

                <c-actions-table
                    v-else-if="view.component === 'table'"
                    :collection-id="collectionId"
                    :view-id="viewId"
                />
            </slot>
        </v-menu>
    </v-card-head>
</template>
