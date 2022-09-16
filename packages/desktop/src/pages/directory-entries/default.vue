<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useDirectoryEntry } from '@/composables/directory-entry'
import DirectoryEntry from '@core/entities/directory-entry'

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

const router = useRouter()

const directoryEntry = useDirectoryEntry(props.workspaceId)

const entry = ref<DirectoryEntry>()

function load(){
    directoryEntry
        .show(props.entryId)
        .then(({ data }) => entry.value = data)
        .catch(() => router.push('/404'))
}

onMounted(load)
</script>

<template>
        <div class="h-full w-full flex items-center justify-center">
            <w-card
                v-if="entry"
                custom:color="bg-gray-500"
                class="w-full max-w-[500px]"
            >
                <div>Name: {{ entry.name }}</div>
                <div>Path: {{ entry.path }}</div>
                <div>Type: {{ entry.type }}</div>
            </w-card>
        </div>
</template>