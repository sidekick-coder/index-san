<script setup lang="ts">
import { useDirectoryEntry } from '@/composables/directory-entry'
import DirectoryEntry from '@core/entities/directory-entry'
import { ref } from 'vue'
import { useStore } from '../store'

const props = defineProps({
    path: {
        type: String,
        required: true,
    },
})

// set entry
const store = useStore()

const entry = ref<DirectoryEntry>()

async function load() {
    await store
        .show({ path: props.path })
        .then((r) => (entry.value = r.data))
        .catch(() => (entry.value = undefined))
}

load()
</script>
<template>
    <is-container class="h-full flex items-center justify-center">
        <v-card class="border border-lines max-w-[500px]">
            <v-card-content v-if="entry" class="flex flex-wrap">
                <div class="w-full"><b>Name: </b> {{ entry.name }}</div>
                <div class="w-full"><b>Path: </b> {{ entry.path }}</div>
                <div class="w-full"><b>Type: </b> {{ entry.type }}</div>
            </v-card-content>
        </v-card>
    </is-container>
</template>
