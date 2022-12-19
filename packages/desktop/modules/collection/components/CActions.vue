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

const view = computed(() => store.view.getView(props.collectionId, props.viewId))

// items

const register = computed(() => store.item.getStoreItem(props.collectionId))

const search = ref({
    input: '',
    show: false,
    onInput: debounce((v) => (search.value.input = v), 100),
})

async function load() {
    await store.item.setItems(props.collectionId)
}

watch(() => search.value.input, debounce(load, 500))

// menu

const menu = ref(false)
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
                            v-if="search.show || !!search.input"
                            :model-value="search.input"
                            :placeholder="$t('search')"
                            size="sm"
                            class="w-[300px] mr-2"
                            @update:model-value="search.onInput"
                        >
                            <template #append>
                                <v-btn
                                    v-if="search.input"
                                    text
                                    size="none"
                                    class="w-5 h-5"
                                    @click="search.input = ''"
                                >
                                    <is-icon name="times" />
                                </v-btn>
                            </template>
                        </is-input>
                    </transition>

                    <v-btn text size="sm" @click="search.show = !search.show">
                        <is-icon name="search" />
                    </v-btn>

                    <v-btn text size="sm" @click="store.item.setItems(collectionId, true)">
                        <is-icon name="rotate" />
                    </v-btn>

                    <c-drawer-hide-columns v-model="view.columns" :collection-id="collectionId" />

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
