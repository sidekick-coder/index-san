<script lang="ts" setup>
import { useDirectoryEntries } from '@/modules/directory/composables/useDirectoryEntries';
import DirectorySidebarItem from './DirectorySidebarItem.vue';
import type { DriveEntry } from '@/composables/useDrive';

const { data: entries, loading, load } = useDirectoryEntries('/')

// root
const drive = useWorkspaceDrive() 

const rootEntry = ref<DriveEntry | null>(null)

onMounted(async () => {
	rootEntry.value = await drive.get('/')
})

onMounted(load)
</script>

<template>
    <div class="flex flex-col">
        <is-list-item
            v-if="rootEntry"
            :to="{
                name: 'entry',
                params: {
                    path: '/' 
                }
            }"

            class="px-4 items-center group border-b border-body-500"
        >
            <is-icon
                name="heroicons:folder-open-solid"
                class="text-primary-300"
                :entry="rootEntry"
            />

            <div class="ml-4 font-bold">
                Root 
            </div>
        </is-list-item>

        <div v-if="loading">
            <div
                v-for="i in 10"
                :key="i"
                class="px-4 py-2"
            >
                <is-list-item
                    
                    class="animate-pulse bg-body-700 "
                    size="xs"
                />
            </div>
        </div>
        
        <div
            v-else
        >
            <div
                v-for="entry in entries"
                :key="entry.path"
            >
                <DirectorySidebarItem
                    :entry="entry"
                />
            </div>
        </div>
    </div>
</template>
