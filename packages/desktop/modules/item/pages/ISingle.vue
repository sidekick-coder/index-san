<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

import debounce from 'lodash/debounce'

import { useStore } from '@/store/global'

import LLayout from '@/modules/layout/LLayout.vue'
import LToolbar from '@/modules/layout/components/LToolbar.vue'
import EMarkdown from '@/modules/entry/pages/EMarkdown.vue'

import IValue from '../components/IValue.vue'
import Item from '@/../core/entities/item'
import { useState } from '@/composables/state'
import DirectoryEntry from '@/../core/entities/directory-entry'

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

const item = computed(() => store.item.get(props.collectionId, props.itemId))

async function setItem() {
    if (!item.value) {
        await store.item.setItems(props.collectionId)
    }

    if (!item.value) {
        router.push('404')
    }
}

watch(props, setItem, {
    immediate: true,
    deep: true,
})

// columns

const columns = computed(() => store.column.all(props.collectionId))

watch(
    () => props.collectionId,
    () => store.column.set(props.collectionId),
    {
        immediate: true,
    }
)

// update item columns

const updateItem = debounce((item: Item, field: string, value: any) => {
    const old = item[field]

    item[field] = value

    store.item.update(props.collectionId, item.id, { [field]: value }).catch(() => {
        item[field] = old
    })
}, 500)

// drawer
const drawer = useState('app:item-drawer', true, {
    localStorage: true,
})

// markdown actions

const editorRef = ref<InstanceType<typeof EMarkdown>>()

function toggleMode() {
    if (!editorRef.value) return

    editorRef.value.edit = !editorRef.value?.edit
}

function reload() {
    if (!editorRef.value) return

    editorRef.value.setPreview()
}

function save() {
    if (!editorRef.value) return

    editorRef.value.save()
}

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
    <l-layout hide-toolbar>
        <l-toolbar>
            <template #append-links>
                <v-btn text size="sm" class="ml-auto" @click="drawer = !drawer">
                    <v-icon name="cog" />
                </v-btn>
            </template>
        </l-toolbar>

        <v-layout v-if="item" use-percentage>
            <v-layout-drawer v-model="drawer" class="border-l border-lines px-4 py-4" right>
                <i-value
                    v-for="c in columns"
                    :key="c.id"
                    :column-id="c.id"
                    :collection-id="collectionId"
                    :item-id="item.id"
                    :label="c.label"
                    :type="c.type"
                    class="mb-4 last:mb-0"
                />
            </v-layout-drawer>

            <v-layout-content v-if="contentPath">
                <e-markdown ref="editorRef" :path="contentPath" :doc:scope="{ item }" />
            </v-layout-content>
        </v-layout>
    </l-layout>
</template>
