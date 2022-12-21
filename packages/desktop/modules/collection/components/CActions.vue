<script setup lang="ts">
import ViewCommon from '@/../core/entities/view-common'

import { debounce } from 'lodash'
import { ref, watch, computed, onMounted } from 'vue'
import { useStore } from '../store'

import CDrawerFilter from './CDrawerFilter.vue'
import CDrawerHideColumns from './CDrawerHideColumns.vue'

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

const collection = computed(() => store.collections.find((c) => c.id === props.collectionId))

onMounted(async () => {
    if (!collection.value) {
        await store.setCollections()
    }
})

// view

const view = computed(() => store.view.get<ViewCommon>(props.collectionId, props.viewId))

// items

const register = computed(() => store.item.getStoreItem(props.collectionId))

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

// refresh

async function refresh() {
    await store.item.setItems(props.collectionId, true)

    await store.column.set(props.collectionId, true)
}
</script>
<template>
    <v-card-head :class="register?.loading ? 'border-b-accent' : ''">
        <slot name="left" />

        <div class="grow"></div>

        <template v-if="view">
            <template v-if="view instanceof ViewCommon">
                <div class="flex items-center transition-all">
                    <transition name="slide-left">
                        <is-input
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
                                    <is-icon name="times" />
                                </v-btn>
                            </template>
                        </is-input>
                    </transition>

                    <v-btn text size="sm" @click="showInput = !showInput">
                        <is-icon name="search" />
                    </v-btn>

                    <v-btn text size="sm" @click="refresh">
                        <is-icon name="rotate" />
                    </v-btn>

                    <c-drawer-hide-columns :collection-id="collectionId" :view-id="viewId" />

                    <c-drawer-filter v-model="view.filters" :columns="collection?.columns" />
                </div>
            </template>

            <is-menu v-model="menu" offset-y offset-x :open-on-click="false">
                <template #activator="{ on }">
                    <div class="h-[44px] flex items-center" v-bind="on">
                        <v-btn text size="sm" @click="menu = !menu">
                            <is-icon name="cog" />
                        </v-btn>
                    </div>
                </template>

                <v-card color="b-secondary">
                    <v-card-content>
                        <is-input v-model="view.label" :label="$t('label')" />
                    </v-card-content>
                </v-card>
            </is-menu>
        </template>
    </v-card-head>
</template>
