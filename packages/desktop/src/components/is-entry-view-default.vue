<script setup lang='ts'>
import { useDirectoryEntry } from '@/composables/directory-entry'
import { definePageMeta } from '@/composables/page-meta'
import DirectoryEntry from '@core/entities/directory-entry'
import { ref } from 'vue'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
})

const entry = ref<DirectoryEntry>()
const meta = definePageMeta({ layout: 'workspace' })
const repository = useDirectoryEntry(props.workspaceId)

async function load(){
    
    const data = await repository.show(props.path)

    meta.value.title = data.name

    entry.value = data
}

load()

</script>
<template>
    <div class="bg-gray-700 p-5 rounded">
        <template v-if="entry">
            <div><b>Name: </b> {{ entry.name }}</div>
            <div><b>Path: </b> {{ entry.path }}</div>
            <div><b>Type: </b> {{ entry.type }}</div>
        </template>
    </div>
</template>