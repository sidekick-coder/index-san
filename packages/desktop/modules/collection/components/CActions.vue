<script setup lang="ts">
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

const view = computed(() => store.view.getRegister(props.collectionId, props.viewId).view)

watch(props, () => store.view.setRegister(props.collectionId, props.viewId), {
    deep: true,
    immediate: true,
})

const search = ref({
    input: '',
    show: false,
    onInput: debounce((v) => (search.value.input = v), 100),
})

async function load() {
    await store.item.setRegister(props.collectionId, {
        filters: view.value.filters,
        search: search.value.input,
    })
}

watch(() => search.value.input, debounce(load, 500))
</script>
<template>
    <v-card-head v-if="collection">
        <slot name="left" />

        <div class="grow"></div>

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

            <v-btn text size="sm" @click="load">
                <is-icon name="rotate" />
            </v-btn>

            <c-drawer-hide-columns v-model="view.columns" :collection-id="collectionId" />

            <c-drawer-filter v-model="view.filters" :columns="collection?.columns" />
        </div>
    </v-card-head>
</template>
