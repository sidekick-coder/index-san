<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import orderBy from 'lodash/orderBy'
    
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

const entries = ref<DirectoryEntry[]>([])
const entriesFormatted = computed(() => orderBy(entries.value, ['type', 'name']).map(e => {
    let to = `/workspaces/${props.workspaceId}/entry/${e.path}`
    let icon = 'file'

    if (e.type === 'directory') {
        to = `/workspaces/${props.workspaceId}/entry-folder/${e.path}`
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
    await directoryEntry
        .list(props.entryId)
        .then(({ data }) => entries.value = data)
        .catch(() => router.push('/404'))
}
    
watch(props, load, { immediate: true })


async function submit(){
    const path = [props.entryId, payload.value.name].join('/')

    let entry = DirectoryEntry.file(path)

    if (payload.value.type !== 'file') {
        entry = DirectoryEntry.directory(path)
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
        <div class="h-full w-full overflow-auto flex p-10 items-baseline">
            <div class="flex flex-wrap w-full">
                <div class="text-2xl w-full mb-4">
                    Entries List
                </div>

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