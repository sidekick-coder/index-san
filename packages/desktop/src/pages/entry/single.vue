<script setup lang="ts">
import { ref } from 'vue'

import DirectoryEntry from '@core/entities/directory-entry'

import { useDirectoryEntry } from '@/composables/directory-entry'
import { definePageMeta } from '@/composables/page-meta'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true
    },
    entryId: {
        type: String,
        default: '/',
    },
})

const meta = definePageMeta({ layout: 'workspace', title: props.entryId })
const repository = useDirectoryEntry(props.workspaceId)

const views = {
    default: 'is-entry-view-default',
    folder: 'is-entry-view-folder'
}

const entry = ref<DirectoryEntry>()
const current = ref<keyof typeof views>('default')


async function load(){
    const data = await repository.show(props.entryId)

    entry.value = data
    meta.value.title = data.name ?? 'Entry'

    if (data.type === 'directory') {
        current.value = 'folder'
    }
}

load()

</script>
<template>
    <div class="h-full w-full">
        <component
            v-if="entry"
            :workspace-id="workspaceId"
            :path="entry.path"
            :is="views[current]" 
        />
    </div>
</template>