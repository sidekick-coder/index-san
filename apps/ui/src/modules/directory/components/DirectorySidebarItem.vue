<script lang="ts" setup>
import type { DriveEntry } from '@/composables/useDrive';
import { useDirectoryStore } from '@/modules/directory/store';
import { findEntryIcon } from '@/modules/directory/composables/findEntryIcon';
import { useDirectoryEntries } from '@/modules/directory/composables/useDirectoryEntries';

import DirectoryEntryIcon from './DirectoryEntryIcon.vue';


// general
const directoryStore = useDirectoryStore()
const route = useRoute()
const router = useRouter()

// entry
const entry = defineProp<DriveEntry>('entry', {
    type: Object,
    required: true
})

const level = defineProp<number>('level', {
    type: Number,
    default: 1
})

const icon = findEntryIcon(entry.value)
const iconColor = directoryStore.findEntryIconColor(entry.value)

// folder
const show = ref(false)

const { data: children, load: loadChildren } = useDirectoryEntries(entry.value.path)

function setShow(){
    if (entry.value.type !== 'directory')  return

    if (!children.value.length) {
        loadChildren()
    }

    if (show.value) return

    show.value = route.path.startsWith(`/entries/${entry.value.path}`)
}

watch(() => route.path, setShow, { immediate: true })

// actions

const active = computed(() => {
    return route.path === `/entries/${entry.value.path}`
})

function onClick() {
    if (entry.value.type === 'directory') {
        show.value = !show.value
        return
    }

    router.push(`/entries/${entry.value.path}`)
}


</script>

<template>
    <is-list-item
        class="px-4 items-center group"        
        size="xs"
        :active="active"
        :style="{ paddingLeft: `${level * 1.5}rem` }"
        @click="onClick"
    >
        <div class="flex flex-col w-full">
            <div class="flex-1 flex items-center">
                <DirectoryEntryIcon
                    :entry="entry"
                    size="sm"
                />
            
                <div class="ml-3 truncate flex-1">
                    {{ entry.name }}
                </div>
        
                <div
                    v-if="entry.type === 'directory' && children.length"
                    class="ml-auto"
                >
                    <is-icon
                        :name="show ? 'heroicons:chevron-up-solid' : 'heroicons:chevron-down-solid'"
                        size="sm"
                    />
                </div>
            </div>
        </div>
    </is-list-item>
        
    <div v-if="show">
        <div
            v-for="child in children"
            :key="child.path"
        >
            <DirectorySidebarItem
                :entry="child"
                :level="level + 1"
            />
        </div>
    </div>
</template>
