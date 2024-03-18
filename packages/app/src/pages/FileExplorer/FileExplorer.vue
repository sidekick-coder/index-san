<script lang="ts" setup>
import type { DriveEntry } from '@/composables/useDrive';
import orderBy from 'lodash/orderBy'


const path = defineProp<string>('path', {
    type: String,
    default: '/'
})

const { drive } = useDrive()
const router = useRouter()

const search = ref('')
const entries = ref<DriveEntry[]>([])
const exclude = {
    folders: ['.is']
}

const filteredEntries = computed(() => {
    return entries.value.filter(e => {
        if (e.type === 'directory' && exclude.folders.includes(e.path)) {
            return false            
        }

        if (search.value.length > 0 && !e.path.includes(search.value)) {
            return false
        }

        return true
    })
})

async function load(){
    entries.value = []

    console.log('Loading', path.value)

    const result = await drive.value.list(path.value)

    entries.value = orderBy(result, ['type', 'path'], ['asc', 'asc'])
}

watch(path, load, { immediate: true })

function onEntryClick(entry: DriveEntry){

    if (entry.type === 'directory') {
        router.push({
            name: 'FileExplorerFolder',
            params: {
                path: entry.path
            }
        })
        return
    }

    console.log(entry)
}

function findIcon(entry: DriveEntry){
    if (entry.type === 'directory') {
        return 'mdi:folder'
    }

    if (entry.path.endsWith('.md')) {
        return 'mdi:markdown'
    }

    if (entry.path.endsWith('.ts')) {
        return 'mdi:language-typescript'
    }

    return 'mdi:file'
}

function findIconColor(entry: DriveEntry){
    if (entry.type === 'directory') {
        return 'text-primary-500'
    }

    if (entry.path.endsWith('.ts')) {
        return 'text-blue-500'
    }

    return 'text-gray-500'
}

</script>
<template>
    <div class="w-full">

        <div class="w-full bg-body-500">
            <input v-model="search" class="bg-transparent w-full h-12 px-4 outline-none" placeholder="Search..." />
        </div>

        <div class="flex flex-col">
            <is-list-item v-for="e in filteredEntries" :key="e.path" @click="onEntryClick(e)">
                <is-icon
                    :name="findIcon(e)"
                    size="xl"
                    :class="findIconColor(e)"
                />

                <div class="ml-4">
                    {{ e.path }}
                </div>
            </is-list-item>
        </div>
    </div>
</template>