<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import orderBy from 'lodash/orderBy'
    
import { useDirectoryEntry } from '@/composables/directory-entry'
import DirectoryEntry from '@core/entities/directory-entry'
import { definePageMeta } from '@/composables/page-meta'
import { useWorkspace } from '@/stores/workspaces'
    
const props = defineProps({
    workspaceId: {
        type: String,
        required: true
    },
    path: {
        type: String,
        default: '/',
    },
})


    
const router = useRouter()    
const store = useWorkspace()

const meta = definePageMeta({ layout: 'workspace' })
const directoryEntry = useDirectoryEntry(props.workspaceId)

const entries = ref<DirectoryEntry[]>([])
const workspace = computed(() => store.all.find(w => w.id === props.workspaceId))
const columns = [
    {
        name: 'icon',
        label: 'icon',
        field: 'icon'
    },
    {
        name: 'name',
        label: 'Name',
        field: 'name'
    },
]
const entriesFormatted = computed(() => orderBy(entries.value, ['type', 'name']).map(e => {
    let to = `/workspaces/${props.workspaceId}/entries/${e.path}`
    let icon = 'file'

    if (e.type === 'directory') {
        // to = `/workspaces/${props.workspaceId}/entry-folder/${e.path}`
        icon = 'folder'
    }

    if (e.name === '.is') {
        icon = 'cog'
    }

    return {
        ...e,
        to,
        icon,
    }
}))

const payload = ref({
    name: '',
    type: 'file'
})

    
async function load(){
    meta.value.title = (workspace.value?.name || 'workspace') + ' (entries)'

    await directoryEntry
        .list(props.path)
        .then(({ data }) => entries.value = data)
        .catch(() => router.push('/404'))
}
    
watch(props, load, { immediate: true, deep: true })


async function submit(){
    const path = [props.path, payload.value.name]

    let entry = DirectoryEntry.file(...path)

    if (payload.value.type !== 'file') {
        entry = DirectoryEntry.directory(...path)
    }

    await directoryEntry.create(entry)

    await load()
}

async function deleteEntry(path: string){
    await directoryEntry.deleteEntry(path)

    await load()
}
</script>
    
<template>
    <div class="h-full w-full flex items-baseline">
        <div class="flex flex-wrap w-full">
            <w-form class="w-full mb-4" @submit="submit">
                <div class="mb-4">
                    <w-input
                        v-model="payload.name" label="Name"
                        placeholder="new-item.txt"
                    />
                </div>
                <div class="mb-4">
                    <w-select
                        v-model="payload.type"
                        label="Type"
                        :options="['file', 'directory']"
                    />
                </div>

                <w-btn :disabled="!payload.name" class="w-full">add</w-btn>
            </w-form>

            <div v-if="!entries.length" class="w-full text-center p-3">
                No items
            </div>

            <router-link
                v-for="item in entriesFormatted"
                :key="item.name"
                :to="item.to"
                class="flex items-center w-full border-b p-3 text-sm"

            >
                <fa-icon
                    :icon="item.icon"
                    class="mr-4 text-gray-400"
                />

                <div>{{ item.name }}</div>

                <div class="grow"></div>

                <div @mousedown.stop="deleteEntry(item.path)" >
                    <fa-icon  icon="trash" />
                </div>

            </router-link>

        </div>
    </div>
</template>