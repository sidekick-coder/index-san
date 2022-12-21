<script setup lang="ts">
import { ref, watch } from 'vue'

import DirectoryEntry from '@core/entities/directory-entry'

import { useMeta } from '@/composables/metas'

import { useStore } from '../store'
import { useRouter } from 'vue-router'

import EFolder from './EFolder.vue'
import EInfo from './EInfo.vue'
import EMarkdown from './EMarkdown.vue'
import ESimpleEditor from './ESimpleEditor.vue'
import EImage from './EImage.vue'

const props = defineProps({
    entryId: {
        type: String,
        default: '/',
    },
})

// set meta
const meta = useMeta({ title: DirectoryEntry.basename(props.entryId) })

// set entry
const store = useStore()
const router = useRouter()

const entry = ref<DirectoryEntry>()

async function setEntry() {
    await store
        .show({ path: props.entryId })
        .then((r) => {
            entry.value = r.data

            meta.value.title = r.data.name || 'Entries'
        })
        .catch(() => router.push('/404'))
}

watch(() => props.entryId, setEntry, { immediate: true })

// set view
const views = {
    default: EInfo,
    folder: EFolder,
    editor: ESimpleEditor,
    markdown: EMarkdown,
    image: EImage,
}

const current = ref<keyof typeof views>('default')

async function setView() {
    current.value = 'default'

    if (!entry.value) {
        return
    }

    const { path, type } = entry.value

    if (/.(md)/.test(path)) {
        current.value = 'markdown'
    }

    if (/.(jpg|jpeg)/.test(path)) {
        current.value = 'image'
    }

    if (/.(js|json|txt|csv|html)/.test(path)) {
        current.value = 'editor'
    }

    if (type === 'directory') {
        current.value = 'folder'
    }

    store.layout.toolbar = current.value !== 'folder'
}

watch(() => entry.value?.path, setView, { deep: true })

// check if is item
</script>
<template>
    <component :is="views[current]" v-if="entry" :path="entry.path" />
</template>
