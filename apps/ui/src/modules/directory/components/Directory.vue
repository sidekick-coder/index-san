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

const { drive, encode } = useDrive()

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

    const result = await drive.list(path.value)

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


watch(() => route.fullPath, setControls, { immediate: true })

// entry crud
async function createFile(){
    let count = 0

    for (const entry of entries.value) {
        if (entry.type !== 'file') {
            continue
        }

        if (!entry.name.startsWith('new-file')) {
            continue
        }

        if (!entry.name.endsWith('.txt')) {
            continue
        }

        count++
    }

    const name = count === 0 ? 'new-file.txt' : `new-file-${count}.txt`

    const filepath = `${path.value}/${name}`

    await drive.write(filepath, encode(''))

    const fileEntry = await drive.get(filepath)

    if (!fileEntry) {
        return
    }

    entries.value.unshift(fileEntry)
}

async function createFolder(){
    let count = 0

    for (const entry of entries.value) {
        if (entry.type !== 'directory') {
            continue
        }

        if (!entry.name.startsWith('new-folder')) {
            continue
        }

        count++
    }

    const name = count === 0 ? 'new-folder' : `new-folder-${count}`

    const filepath = `${path.value}/${name}`

    await drive.mkdir(filepath)

    const folderEntry = await drive.get(filepath)

    if (!folderEntry) {
        return
    }

    entries.value.unshift(folderEntry)
}

async function deleteEntry(e: DriveEntry){

    const value = confirm('Are you sure you want to delete this entry?')

    if (!value) {
        return
    }

    await drive.destroy(e.path)

    await load()
}

// edit
const editedEntry = ref({
    loading: false,
    inputRef: null as any | null,
    name: '',
    originalName: '',
})

function editEntry(e: DriveEntry){
    editedEntry.value.name = e.name
    editedEntry.value.originalName = e.name
}

async function saveEditedEntry(){
    if (editedEntry.value.loading) {
        return
    }

    const { name, originalName } = editedEntry.value

    if (name === originalName) {
        editedEntry.value.name = ''
        editedEntry.value.originalName = ''
        return
    }

    editedEntry.value.loading = true

    await drive.move(`${path.value}/${originalName}`, `${path.value}/${name}`)

    await load()

    editedEntry.value.name = ''
    editedEntry.value.originalName = ''

    editedEntry.value.loading = false
}

watch(() => editedEntry.value.inputRef, (inputRef) => {
    if (inputRef) {
        inputRef.focus()
    }
})

</script>
<template>
    <div class="w-full h-full flex flex-col">
        <div class="w-full h-14 border-b border-body-500 flex items-center px-10 gap-x-5">
            <div class="-ml-3 flex gap-x-2">
                <is-btn
                    variant="text"
                    color="primary"
                    size="none"
                    class="h-10 w-10"
                    :class="controls.home ? '' : 'text-gray-500 pointer-events-none'"
                    to="/entries"
                >
                    <is-icon name="heroicons:home-solid" />
                </is-btn>
                
                <is-btn
                    variant="text"
                    color="primary"
                    size="none"
                    class="h-10 w-10"
                    :class="controls.back ? '' : 'text-gray-500 pointer-events-none'"
                    @click="$router.back()"
                >
                    <is-icon name="heroicons:arrow-left-circle-solid" />
                </is-btn>
                
                <is-btn
                    variant="text"
                    color="primary"
                    size="none"
                    class="h-10 w-10"
                    :class="controls.forward ? '' : 'text-gray-500 pointer-events-none'"
                    @click="$router.forward()"
                >
                    <is-icon name="heroicons:arrow-right-circle-solid" />
                </is-btn>

                <is-btn
                    variant="text"
                    color="primary"
                    size="none"
                    class="h-10 w-10"
                    @click="load"
                >
                    <is-icon name="heroicons:arrow-path-solid" />
                </is-btn>
                <is-menu>
                    <template #activator="{ attrs }">
                        <is-btn
                            variant="text"
                            color="primary"
                            size="none"
                            class="h-10 w-10"
                            v-bind="attrs"
                        >
                            <is-icon name="heroicons:plus-solid" />
                        </is-btn>                    
                    </template>

                    <is-card>
                        <is-list-item
                            size="sm"
                            @click="createFile"
                        >
                            <is-icon name="heroicons-solid:document" />
                            <div class="ml-4">
                                New File
                            </div>
                        </is-list-item>
                        <is-list-item
                            size="sm"
                            @click="createFolder"
                        >
                            <is-icon name="heroicons-solid:folder" />
                            <div class="ml-4">
                                New Folder
                            </div>
                        </is-list-item>
                    </is-card>
                </is-menu>
            </div>

            <div class="flex-1">
                <div
                    class="text-xs h-10 bg-body-500 w-full px-4 py-2 outline-none rounded flex items-center gap-x-2 text-body-100"
                >
                    <is-icon name="heroicons-solid:computer-desktop" />

                    {{ path === '/' ? '/' : `/${path}` }}
                </div>  
            </div>

            <div class="w-80">
                <input
                    v-model="search"
                    class="bg-body-500 w-full px-4 py-2 outline-none rounded text-xs h-10 border border-transparent focus:border-primary-500"
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
                    :class="editedEntry.originalName === e.name ? 'bg-body-500' : ''"
                    class="px-10 items-center group"
                >
                    <div class="flex-1 flex items-center">
                        <is-icon
                            :name="findIcon(e)"
                            size="xl"
                            :class="findIconColor(e)"
                        />
    
                        <div class="ml-4">
                            <input
                                v-if="editedEntry.originalName === e.name"
                                :ref="el => editedEntry.inputRef = el"
                                v-model="editedEntry.name"
                                class="bg-transparent outline-none"
                                autofocus
                                spellcheck="false"
                                @click.prevent
                                @blur="saveEditedEntry"
                                @keydown.enter="saveEditedEntry"
                            >

                            <div v-else>
                                {{ e.name }}
                            </div>
                        </div>
                    </div>

                    <div>
                        <is-btn
                            v-if="editedEntry.originalName === e.name"
                            variant="text"
                            color="primary"
                            size="none"
                            class="h-8 w-8"
                            @click.prevent.stop="saveEditedEntry"
                        >
                            <is-icon name="heroicons-solid:check" />
                        </is-btn>

                        <template v-else>
                            <is-btn
                                variant="text"
                                color="primary"
                                size="none"
                                class="h-8 w-8 opacity-0 group-hover:opacity-100"
                                @click.prevent.stop="editEntry(e)"
                            >
                                <is-icon name="heroicons-solid:pencil" />
                            </is-btn>
    
                            <is-btn
                                variant="text"
                                color="primary"
                                size="none"
                                class="h-8 w-8 opacity-0 group-hover:opacity-100"
                                @click.prevent.stop="deleteEntry(e)"
                            >
                                <is-icon name="heroicons-solid:trash" />
                            </is-btn>
                        </template>
                    </div>
                </is-list-item>
            </div>
        </div>
    </div>
</template>