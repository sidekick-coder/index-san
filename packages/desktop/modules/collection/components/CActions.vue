<script setup lang="ts">
import ViewCommon from '@/../core/entities/view-common'

import { debounce } from 'lodash'
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import { useStore } from '@/store/global'

import CDrawerFilter from './CDrawerFilter.vue'
import CActionsOrder from './CActionsOrder.vue'
import View from '@/../core/entities/view'
import { useView } from '@/modules/view/composables/use-view'

import CActionsColumns from './CActionsColumns.vue'

const CActionsGallery = defineAsyncComponent(() => import('./CActionsGallery.vue'))
const CActionsTable = defineAsyncComponent(() => import('./CActionsTable.vue'))

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

// collection
const store = useStore()

const columns = computed(() => store.column.all(props.collectionId))

// view

const { view, load, state } = useView<ViewCommon>({
    collectionId: props.collectionId,
    viewId: props.viewId,
    defaultValue: new ViewCommon({}, props.viewId),
})

watch(
    props,
    () =>
        load({
            collectionId: props.collectionId,
            viewId: props.viewId,
        }),
    { deep: true }
)

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

async function refresh() {
    await store.item.setItems(props.collectionId, true)

    await store.column.set(props.collectionId, true)
}

function isCommon(v: View): v is ViewCommon {
    return ['table', 'gallery'].includes(v.component)
}
</script>
<template>
    <v-card-head class="overflow-x-auto">
        <slot name="left" />

        <div class="grow"></div>

        <template v-if="view && !state.loading">
            <template v-if="isCommon(view)">
                <div class="flex items-center transition-all">
                    <transition name="slide-left">
                        <v-input
                            v-if="showInput || !!input"
                            v-model="input"
                            :placeholder="$t('search')"
                            size="sm"
                            class="w-[300px] mr-2"
                        >
                            <template #append>
                                <v-btn
                                    v-if="input"
                                    text
                                    size="none"
                                    class="w-5 h-5"
                                    @click="input = ''"
                                >
                                    <v-icon name="times" />
                                </v-btn>
                            </template>
                        </v-input>
                    </transition>

                    <v-btn text size="sm" @click="showInput = !showInput">
                        <v-icon name="search" />
                    </v-btn>

                    <v-btn text size="sm" @click="refresh">
                        <v-icon name="rotate" />
                    </v-btn>

                    <c-actions-order :collection-id="collectionId" :view-id="viewId" />

                    <c-drawer-filter v-model="view.filters" :columns="columns" />

                    <c-actions-columns :collection-id="collectionId" :view-id="viewId" />
                </div>
            </template>

            <v-menu v-model="menu" offset-y offset-x :open-on-click="false">
                <template #activator="{ attrs }">
                    <div class="h-[44px] flex items-center" v-bind="attrs">
                        <v-btn text size="sm" @click="menu = !menu">
                            <v-icon name="cog" />
                        </v-btn>
                    </div>
                </template>

                <slot name="config-card">
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
        </template>
    </v-card-head>
</template>
