<script setup lang="ts">
import DirectoryEntry from '@index-san/core/entities/directory-entry'

import { useMeta } from '@composables/metas'

import { useStore } from '../store'
import { useRouter } from 'vue-router'

const EFolder = defineAsyncComponent(() => import('./EFolder.vue') as any)
const EInfo = defineAsyncComponent(() => import('./EInfo.vue') as any)
const EMarkdown = defineAsyncComponent(() => import('./EMarkdown.vue') as any)
const EImage = defineAsyncComponent(() => import('./EImage.vue') as any)
const ECodeEditor = defineAsyncComponent(() => import('./ECodeEditor.vue') as any)
const ESimpleEditor = defineAsyncComponent(() => import('./ESimpleEditor.vue') as any)

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
    code: ECodeEditor,
}

const current = ref<keyof typeof views>('default')

async function setView() {
    current.value = 'default'

    if (!entry.value) {
        return
    }

    const { path, type } = entry.value

    if (type === 'directory') {
        current.value = 'folder'
        return
    }

    if (/.(md)/.test(path)) {
        current.value = 'markdown'
        return
    }

    if (/.(jpg|jpeg)/.test(path)) {
        current.value = 'image'
        return
    }

    if (/.(json|txt|csv|html)/.test(path)) {
        current.value = 'editor'
        return
    }
    if (/.(js|ts)/.test(path)) {
        current.value = 'code'
        return
    }
}

watch(() => entry.value?.path, setView, { deep: true })

// check if is item
</script>
<template>
    <component
        :is="views[current]"
        v-if="entry"
        :path="entry.path"
    />
</template>
