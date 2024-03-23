<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useStore } from '@store/global'

import EMarkdown from '@modules/entry/pages/EMarkdown.vue'

import IValue from '../components/IValue.vue'
import Item from '@index-san/core/entities/item'
import DirectoryEntry from '@index-san/core/entities/directory-entry'
import { useColumnStore } from '@modules/column/store'
import { useLocalStorage } from '@vueuse/core'

// Props & Emit
const props = defineProps({
    collectionId: {
        type: String,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },
})

// collection
const store = useStore()

const collection = computed(() => store.collection.get(props.collectionId))

// item
const router = useRouter()

const item = ref<Item>()

const loading = ref(false)

async function setItem() {
    loading.value = true

    await store.item
        .show(props.collectionId, props.itemId)
        .then((r) => (item.value = r ?? undefined))
        .catch(() => router.push('404'))
        .finally(() => (loading.value = false))
}

watch(props, setItem, {
    immediate: true,
    deep: true,
})

// columns
let columnStore = useColumnStore(props.collectionId)

async function load() {
    columnStore = useColumnStore(props.collectionId)

    if (!columnStore.columns.length) {
        await columnStore.load()
    }
}

watch(() => props.collectionId, load)

// drawer
const drawer = useLocalStorage('app:item-drawer', true)

// content path

const contentPath = ref<string | null>(null)

function setContentPath() {
    contentPath.value = null

    if (!collection.value) return

    contentPath.value = DirectoryEntry.normalize(collection.value.path, props.itemId, 'content.md')
}

watch(() => props.itemId, setContentPath, {
    immediate: true,
})
</script>
<template>
    <v-layout use-percentage>
        <v-layout-drawer
            :model-value="drawer"
            class="border-l border-lines px-4 py-4"
            right
        >
            <div v-if="item">
                <i-value
                    v-for="c in columnStore.columns"
                    :key="c.id"
                    :column-id="c.id"
                    :collection-id="collectionId"
                    :item-id="item.id"
                    :label="c.label"
                    :type="c.type"
                    edit
                    class="mb-4 last:mb-0"
                />
            </div>
        </v-layout-drawer>

        <v-layout-content>
            <e-markdown
                v-if="contentPath"
                ref="editorRef"
                :path="contentPath"
                :doc:scope="{ item }"
            >
                <template #append-actions>
                    <v-btn
                        mode="text"
                        size="sm"
                        @click="drawer = !drawer"
                    >
                        <v-icon name="cog" />
                    </v-btn>
                </template>
            </e-markdown>
        </v-layout-content>
    </v-layout>
</template>
