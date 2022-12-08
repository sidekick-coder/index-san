<script setup lang="ts">
import { ref, watch } from 'vue'

import DirectoryEntry from '@core/entities/directory-entry'

import { useDirectoryEntry } from '@/composables/directory-entry'
import { definePageMeta } from '@/composables/page-meta'

import EMarkdown from './EMarkdown.vue'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    entryId: {
        type: String,
        default: '/',
    },
})

const meta = definePageMeta({ title: props.entryId })

const views = {
    default: 'is-entry-view-default',
    folder: 'is-entry-view-folder',
    text: 'is-entry-view-text',
    markdown: EMarkdown,
    image: 'is-entry-view-image',
    blockEditor: 'is-entry-view-block-editor',
}

const entry = ref<DirectoryEntry>()
const current = ref<keyof typeof views>('default')

function getRecommendedView({ path, type }: DirectoryEntry): keyof typeof views {
    if (/.(md)/.test(path)) {
        return 'markdown'
    }

    if (/.(txt|json)/.test(path)) {
        return 'text'
    }

    if (/.(jpeg|jpg|png)/.test(path)) {
        return 'image'
    }

    if (/.(is)/.test(path)) {
        return 'blockEditor'
    }

    if (type === 'directory') {
        return 'folder'
    }

    return 'default'
}

async function load() {
    entry.value = undefined

    const data = await useDirectoryEntry(props.workspaceId).show(props.entryId)

    entry.value = data
    meta.value.title = data.name ?? 'Entry'

    current.value = getRecommendedView(data)
}

watch(() => props.entryId, load, {
    immediate: true,
})
</script>
<template>
    <component :is="views[current]" v-if="entry" :workspace-id="workspaceId" :path="entry.path" />
</template>
