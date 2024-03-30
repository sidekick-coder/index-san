<script lang="ts" setup>
import type { DriveEntry } from '@/composables/useDrive';
import { useDirectoryStore } from '@/modules/directory/store';

const directoryStore = useDirectoryStore();

const title = defineProp('title',{
    type: String,
    default: 'Entries'
})

const entries = defineProp<DriveEntry>('entries',{
    type: Array,
    default: () => []
})

const show = ref(true)

</script>

<template>
    <div>
        <is-list-item
            size="xs"
            class="text-body-100 font-bold"
        >
            <div class="flex-1">
                {{ title }}
            </div>

            <div>
                <is-btn
                    variant="text"
                    size="none"
                    class="h-6 w-6"
                    @click="show = !show"
                >
                    <is-icon
                        :name="show ? 'heroicons:chevron-up-solid' : 'heroicons:chevron-down-solid'"
                        size="xs"
                    />
                </is-btn>
            </div>
        </is-list-item>

        <div v-if="show">
            <is-list-item
                v-if="!entries.length"
                size="xs"
                class="text-body-100"
            >
                No entries
            </is-list-item>

            <is-list-item
                v-for="entry in entries"
                :key="entry.path"
                size="xs"
                class="flex items-center"
            >
                <div class="mr-4">
                    <is-icon
                        :name="directoryStore.findEntryIcon(entry)"
                        :class="directoryStore.findEntryIconColor(entry)"
                        size="xs"
                    />
                </div>
    
                <div class="flex-1">
                    {{ entry.path }}
                </div>

                <div>
                    <is-btn
                        variant="text"
                        size="none"
                        class="h-6 w-6 text-body-100"
                        :to="`/entries/${entry.path}`"
                    >
                        <is-icon
                            name="heroicons:document-solid"
                            size="xs"
                        />
                    </is-btn>

                    <slot
                        name="actions"
                        :entry="entry"
                    />
                </div>
            </is-list-item>
        </div>
    </div>
</template>
