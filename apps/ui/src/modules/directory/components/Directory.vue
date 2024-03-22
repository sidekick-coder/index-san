<script lang="ts" setup>
import type { DriveEntry } from '@/composables/useDrive';
import orderBy from 'lodash/orderBy'

// general
const route = useRoute()

// entries
const path = defineProp<string>('path', {
    type: String,
    default: '/',
})

const { drive } = useDrive()

const loading = ref(true)
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
    loading.value = true

    entries.value = []

    const result = await drive.value.list(path.value)

    entries.value = orderBy(result, ['type', 'path'], ['asc', 'asc'])

    setTimeout(() => {
        loading.value = false
    }, 800)
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


watch(path, load, { immediate: true })


// controls
const controls = ref({
    home: false,
    back: false,
    forward: false,
})

function setControls(){
    controls.value.home = path.value !== '/'
    controls.value.back = !!history.state.back && path.value !== '/'
    controls.value.forward = !!history.state.forward
}


watch(() => route.path, setControls, { immediate: true })

</script>
<template>
    <div class="w-full h-full flex flex-col">
        <div class="w-full h-16 border-b border-body-500 flex items-center px-10 gap-x-5">
            <div class="-ml-3">
                <is-btn
                    variant="text"
                    color="primary"
                    size="none"
                    class="h-10 w-10"
                    :class="controls.home ? '' : 'text-gray-500 pointer-events-none'"
                    to="/entries"
                >
                    <is-icon name="heroicons-solid:home" />
                </is-btn>
                
                <is-btn
                    variant="text"
                    color="primary"
                    size="none"
                    class="h-10 w-10"
                    :class="controls.back ? '' : 'text-gray-500 pointer-events-none'"
                    @click="$router.back()"
                >
                    <is-icon name="heroicons-solid:arrow-left-circle" />
                </is-btn>
                
                <is-btn
                    variant="text"
                    color="primary"
                    size="none"
                    class="h-10 w-10"
                    :class="controls.forward ? '' : 'text-gray-500 pointer-events-none'"
                    @click="$router.forward()"
                >
                    <is-icon name="heroicons-solid:arrow-right-circle" />
                </is-btn>

                <is-btn
                    variant="text"
                    color="primary"
                    size="none"
                    class="h-10 w-10"
                    @click="load"
                >
                    <is-icon name="heroicons-solid:refresh" />
                </is-btn>
            </div>

            <div class="flex-1">
                <div
                    class="text-sm h-10 bg-body-500 w-full px-4 py-2 outline-none rounded flex items-center gap-x-2 text-body-100"
                >
                    <is-icon name="heroicons-solid:computer-desktop" />

                    {{ path === '/' ? '/' : `/${path}` }}
                </div>  
            </div>

            <div class="w-80">
                <input
                    v-model="search"
                    class="bg-body-500 w-full px-4 py-2 outline-none rounded text-sm h-10 border border-transparent focus:border-primary-500"
                    placeholder="Search..."
                >
            </div>
        </div>

        <div class="flex-1 overflow-y-auto relative">
            <div
                v-if="loading"
                class="absolute w-full h-1 bg-primary-500 animate-pulse"
            />

            <div
                v-else-if="!filteredEntries.length"
                class="justify-center text-sm absolute size-full flex items-center text-body-100"
            >
                <div>
                    No entries
                </div>
            </div>
            
            <div class="flex flex-col pb-[25rem] relative">
                <is-list-item
                    v-for="e in filteredEntries"
                    :key="e.path"
                    :to="`/entries/${e.path}`"
                    class="px-10"
                >
                    <is-icon
                        :name="findIcon(e)"
                        size="xl"
                        :class="findIconColor(e)"
                    />

                    <div class="ml-4">
                        {{ e.name }}
                    </div>
                </is-list-item>
            </div>
        </div>
    </div>
</template>