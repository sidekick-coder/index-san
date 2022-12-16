<script setup lang="ts">
import { ref, watch } from 'vue'

import DirectoryEntry from '@core/entities/directory-entry'

import { useMeta } from '@/composables/metas'

import { useStore } from '../store'
import { useRouter } from 'vue-router'

import EFolder from './EFolder.vue'
import EInfo from './EInfo.vue'
import EJson from './EJson.vue'
import EMarkdown from './EMarkdown.vue'
import EJs from './EJs.vue'
import EText from './EText.vue'

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

            meta.value.title = entry.value.name || 'Entries'
        })
        .catch(() => router.push('/404'))
}

watch(() => props.entryId, setEntry, { immediate: true })

// set view
const views = {
    default: EInfo,
    folder: EFolder,
    json: EJson,
    js: EJs,
    text: EText,
    markdown: EMarkdown,
    // image: 'is-entry-view-image',
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

    if (/.(js)/.test(path)) {
        current.value = 'js'
    }

    if (/.(json)/.test(path)) {
        current.value = 'json'
    }

    if (/.(txt|csv|html)/.test(path)) {
        current.value = 'text'
    }

    if (type === 'directory') {
        current.value = 'folder'
    }

    store.layout.toolbar = current.value !== 'folder'
}

watch(() => entry.value?.path, setView, { deep: true })
</script>
<template>
    <component :is="views[current]" v-if="entry" :path="entry.path" />
</template>
