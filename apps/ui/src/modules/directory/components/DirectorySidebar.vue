<script lang="ts" setup>
import { useDirectoryEntries } from '@/modules/directory/composables/useDirectoryEntries';
import DirectorySidebarItem from './DirectorySidebarItem.vue';

const { data: entries, loading, load } = useDirectoryEntries('/')

onMounted(load)

</script>

<template>
    <div class="flex flex-col">
        <div class="px-4 flex bg-body-900 h-8 items-center border-b border-body-500">
            <div class="text-xs">
                Explorer                
            </div>

            <div class="flex-1" />

            <is-btn
                variant="text"
                size="xs"
                to="/entries"
            >
                <is-icon
                    name="heroicons:folder-open-solid"
                    size="sm"
                />
            </is-btn>
        </div>

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
        
        <div v-else>
            <div
                v-for="entry in entries"
                :key="entry.path"
            >
                <DirectorySidebarItem :entry="entry" />
            </div>
        </div>
    </div>
</template>
