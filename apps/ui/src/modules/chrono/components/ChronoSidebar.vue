
<script lang="ts" setup>
import type { DriveEntry } from '@/composables/useDrive';
import { useChronoStore } from '@/modules/chrono/store';
import orderBy from 'lodash/orderBy';

import ChronoSidebarEntryList from './ChronoSidebarEntryList.vue';

const chronoStore = useChronoStore();

// status
const changed = computed<DriveEntry[]>(() => {
    const untracked = convertPathsToDriveEntries(chronoStore.status.untracked)
    const changed = convertPathsToDriveEntries(chronoStore.status.changed)
    const deleted = convertPathsToDriveEntries(chronoStore.status.deleted)

    return orderBy(untracked.concat(changed).concat(deleted), 'path', 'asc');
});

const added = computed<DriveEntry[]>(() => {
    const entries = convertPathsToDriveEntries(chronoStore.status.added)

    return orderBy(entries, 'path', 'asc');
});



async function addItem(path: string) {
    await chronoStore.add(path);

    await chronoStore.setStatus();
}

function removeItem(path: string) {
    chronoStore.remove(path);
}

onMounted(chronoStore.setStatus)

// commit
const commitMessage = ref('');

async function commit() {
    await chronoStore.commit(commitMessage.value);

    commitMessage.value = '';
}


</script>

<template>
    <div :class="chronoStore.loadingStatus ? 'opacity-50 pointer-events-none' : ''">
        <div class="px-4 flex bg-body-900 h-12 items-center border-b border-body-500">
            <div class="flex-1 text-xs">
                Version control system
            </div>

            <is-btn
                variant="text"
                size="none"
                class="h-6 w-6"
                @click="chronoStore.setStatus"
            >
                <is-icon
                    name="heroicons:arrow-path-solid"
                    size="xs"
                    :class="chronoStore.loadingStatus ? 'animate-spin' : ''"
                />
            </is-btn>
        </div>

        <div
            v-if="!chronoStore.hasRepository"
            class="flex flex-col items-center p-4 gap-y-4"
        >
            <div class=" text-body-100 text-xs">
                No repository found
            </div>

            <is-btn
                size="sm"
                @click="chronoStore.init"
            >
                Create repository
            </is-btn>
        </div>

        <template v-else>
            <div class="px-4 py-4 flex flex-col gap-y-4">
                <div class="text-body-100 font-bold text-xs">
                    Commit
                </div>
    
                <input
                    v-model="commitMessage"
                    placeholder="commit message"
                    class="w-full px-4 py-2 bg-body-700 rounded text-sm outline-none placeholder:text-body-100"
                >
    
                <is-btn
                    size="sm"
                    :disabled="!added.length || !commitMessage"
                    @click="commit"
                >
                    Commit
                </is-btn>
            </div>

            <ChronoSidebarEntryList
                title="Stage files"
                :entries="added"
            >
                <template #actions="{ entry }">
                    <is-btn
                        variant="text"
                        size="none"
                        class="h-6 w-6"
                        @click="removeItem(entry.path)"
                    >
                        <is-icon
                            name="heroicons:minus-solid"
                            size="xs"
                        />
                    </is-btn>
                </template>
            </ChronoSidebarEntryList>
            
            <ChronoSidebarEntryList
                title="Changed files"
                :entries="changed"
            >
                <template #actions="{ entry }">
                    <is-btn
                        variant="text"
                        size="none"
                        class="h-6 w-6"
                        @click="addItem(entry.path)"
                    >
                        <is-icon
                            name="heroicons:plus-solid"
                            size="xs"
                        />
                    </is-btn>
                </template>
            </ChronoSidebarEntryList>
        </template>
    </div>
</template>
