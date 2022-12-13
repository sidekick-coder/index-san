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

// async function load() {
//     entry.value = undefined

//     const data = await useDirectoryEntry(props.workspaceId).show(props.entryId)

//     entry.value = data
//     meta.value.title = data.name ?? 'Entry'

//     current.value = getRecommendedView(data)
// }

// set meta
useMeta({ title: props.entryId })

// set entry
const store = useStore()
const router = useRouter()

const entry = ref<DirectoryEntry>()

async function setEntry() {
    await store
        .show({ path: props.entryId })
        .then((r) => (entry.value = r.data))
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

    if (/.(txt|csv)/.test(path)) {
        current.value = 'text'
    }

    if (type === 'directory') {
        current.value = 'folder'
    }
}

watch(entry, setView, { deep: true })
</script>
<template>
    <component :is="views[current]" v-if="entry" :path="entry.path" />
</template>
