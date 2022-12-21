<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

import debounce from 'lodash/debounce'

import { useStore } from '../store'

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

const item = computed(() => store.get(props.collectionId, props.itemId))

async function setItem() {
    if (!item.value) {
        await store.setItems(props.collectionId)
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

    store.update(props.collectionId, item.id, { [field]: value }).catch(() => {
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
                <v-btn size="sm" class="ml-auto" text @click="toggleMode">
                    <v-icon :name="!editorRef?.edit ? 'pen' : 'eye'" />
                </v-btn>

                <v-btn size="sm" text @click="reload">
                    <v-icon name="arrows-rotate" />
                </v-btn>

                <v-btn size="sm" text @click="save">
                    <v-icon name="save" />
                </v-btn>

                <v-btn text size="sm" @click="drawer = !drawer">
                    <v-icon name="cog" />
                </v-btn>
            </template>
        </l-toolbar>

        <v-layout v-if="item" use-percentage>
            <v-layout-drawer v-model="drawer" class="border-l border-lines px-4 py-4" right>
                <i-value
                    v-for="c in columns"
                    :key="c.id"
                    :model-value="item[c.field as string]"
                    :column="c"
                    :item="item"
                    class="mb-4 last:mb-0"
                    :label="c.label"
                    @update:model-value="updateItem(item!, c.field!, $event)"
                />
            </v-layout-drawer>

            <v-layout-content v-if="contentPath">
                <e-markdown
                    ref="editorRef"
                    hide-actions
                    :path="contentPath"
                    :doc:scope="{ item }"
                />
            </v-layout-content>
        </v-layout>
    </l-layout>
</template>
