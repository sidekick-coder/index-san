<script setup lang="ts">
import { useRouter } from 'vue-router'

import DirectoryEntry from '@core/entities/directory-entry'
import { useI18n } from 'vue-i18n'
import { useStore } from '../store'

import VTr from '@components/VTr.vue'
import EEntryIcon from '../components/EEntryIcon.vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import VTable from '@components/VTable.vue'

const props = defineProps({
    path: {
        type: String,
        default: '/',
    },
})

// set items
const store = useStore()
const router = useRouter()

const entries = ref<DirectoryEntry[]>([])
const firstRun = ref(true)
const loading = ref(false)

async function setEntries() {
    if (firstRun.value) {
        loading.value = true
        firstRun.value = false
    }

    await store
        .list({ path: props.path })
        .then((r) => (entries.value = r.data))
        .catch(() => router.push('/404'))
        .finally(() => setTimeout(() => (loading.value = false), 500))

    entries.value.sort((a, b) => b.type.length - a.type.length)
}

watch(() => props.path, setEntries, {
    immediate: true,
})

// search item
const search = ref('')

const filteredEntries = computed(() => {
    return entries.value.filter((e) => e.name.toLowerCase().includes(search.value.toLowerCase()))
})

watch(
    () => props.path,
    () => (search.value = '')
)

// Table

const tm = useI18n()

const columns = [
    {
        name: 'name',
        field: 'name',
        label: tm.t('name'),
    },
]

// create entries

const menu = ref(false)

function createFilename(prefix = 'New') {
    let count = 0
    const ext = DirectoryEntry.extname(prefix)

    let prefixWithoutExt = prefix

    if (ext) {
        prefixWithoutExt = prefix.replace(`.${ext}`, '')
    }

    entries.value.forEach((e) => {
        let result = `${prefixWithoutExt} (${count})`

        if (ext) {
            result += `.${ext}`
        }

        if (count === 0 && e.name === prefix) {
            count++
            return
        }

        if (e.name === result) {
            count++
        }
    })

    if (count === 0) {
        return prefix
    }

    let result = `${prefixWithoutExt} (${count})`

    if (ext) {
        result += `.${ext}`
    }

    return result
}

async function addFile() {
    const data = DirectoryEntry.file(props.path, createFilename('New file'))

    await store.create({ data })

    menu.value = false

    entries.value.push(data)
}

async function addFolder() {
    const data = DirectoryEntry.directory(props.path, createFilename('New folder'))

    await store.create({ data })

    menu.value = false

    entries.value.push(data)
}

// delete entry

async function deleteEntry(item: DirectoryEntry) {
    const index = entries.value.indexOf(item)

    await store.destroy({ path: item.path })

    entries.value.splice(index, 1)
}

// select item

const selected = ref<number[]>([])
const tableRef = ref(null)
const menuCardRef = ref(null)
const trRef = ref<InstanceType<typeof VTr>[]>([])

function updateSelection() {
    if (selected.value.length !== 1) return

    const index = selected.value[0]

    if (trRef.value[index]) {
        trRef.value[index].$el?.focus()
    }
}

watch(selected, updateSelection)

watch(
    () => props.path,
    () => (selected.value = [])
)

onClickOutside(tableRef, () => (selected.value = []), { ignore: [menuCardRef] })

onKeyStroke(['ArrowDown', 'ArrowUp'], (e) => {
    if (!entries.value.length) return

    if (!selected.value.length) {
        selected.value = [0]
        return
    }

    const next = selected.value[0] + 1
    const prev = selected.value[0] - 1

    if (e.key === 'ArrowDown' && !!entries.value[next]) {
        selected.value = [next]
    }

    if (e.key === 'ArrowUp' && !!entries.value[prev]) {
        selected.value = [prev]
    }
})

// update

const editItem = ref<number>()

async function updateItem(item: DirectoryEntry) {
    const newPath = DirectoryEntry.normalize(props.path, item.name)

    const index = editItem.value

    if (index === undefined) return

    if (newPath === item.path) {
        editItem.value = undefined
        return
    }

    await store
        .update({
            newPath,
            path: item.path,
        })
        .then(() => {
            entries.value[index].path = newPath
            editItem.value = undefined
        })
        .catch(() => {
            item.name = DirectoryEntry.basename(item.path)
        })

    editItem.value = undefined
}

watch(selected, () => (editItem.value = undefined))

// show

function show(item: DirectoryEntry) {
    if (editItem.value !== undefined) return

    return router.push(`/entries/${item.path}`)
}

async function onEnter(item: DirectoryEntry) {
    const index = entries.value.indexOf(item)

    const promise = editItem.value === index ? updateItem : show

    await promise(item)

    updateSelection()
}

// menu
const entryMenu = ref({
    x: 0,
    y: 0,
    show: false,
    item: null as DirectoryEntry | null,
})

function showEntryMenu(event: MouseEvent, item?: DirectoryEntry) {
    entryMenu.value.item = null

    entryMenu.value.x = event.clientX
    entryMenu.value.y = event.clientY

    entryMenu.value.show = true

    if (!item) return

    entryMenu.value.item = item

    const index = entries.value.indexOf(item)

    if (selected.value.length === 1) {
        selected.value = [index]
        return
    }

    if (!selected.value.includes(index)) {
        selected.value.push(index)
    }
}

async function duplicate() {
    const entriesToDuplicate = selected.value.map((i) => entries.value[i])

    for await (const entry of entriesToDuplicate) {
        let ext = DirectoryEntry.extname(entry.name)

        let filename = entry.name + ` (${tm.t('copy').toLocaleLowerCase()})`

        if (ext) {
            filename = entry.name.replace(
                `.${ext}`,
                ` (${tm.t('copy').toLocaleLowerCase()}).${ext}`
            )
        }

        filename = createFilename(filename)

        const copy = new DirectoryEntry(entry)

        copy.path = DirectoryEntry.normalize(props.path, filename)
        copy.name = filename

        await store.copy(entry.path, copy.path)

        entries.value.push(copy)
    }
}

function copy() {
    if (editItem.value) return

    const paths = selected.value.map((index) => entries.value[index].path)

    navigator.clipboard.writeText(`copy-entries:${paths.join(';')}`)
}

function cut() {
    if (editItem.value) return

    const paths = selected.value.map((index) => entries.value[index].path)

    navigator.clipboard.writeText(`cut-entries:${paths.join(';')}`)
}

async function paste() {
    if (editItem.value) return

    const content = await navigator.clipboard.readText()

    if (content.startsWith('copy-entries:')) {
        const paths = content.replace('copy-entries:', '').split(';')

        for await (const path of paths) {
            const target = DirectoryEntry.normalize(props.path, DirectoryEntry.basename(path))

            await store.copy(path, target)
        }

        await setEntries()
    }

    if (content.startsWith('cut-entries:')) {
        const paths = content.replace('cut-entries:', '').split(';')

        for await (const path of paths) {
            if (path.startsWith(props.path)) continue

            const target = DirectoryEntry.normalize(props.path, DirectoryEntry.basename(path))

            await store.move(path, target)
        }

        await setEntries()
    }
}

async function deleteAll() {
    if (!selected.value.length) return

    const entriesToDelete = selected.value.map((i) => entries.value[i])

    for await (const entry of entriesToDelete) {
        await deleteEntry(entry)
    }

    const newIndex = Math.max(0, entries.value.length - 1)

    selected.value = entries.value[newIndex] ? [newIndex] : []
}

onKeyStroke('Delete', deleteAll)

onKeyStroke(['c'], (e) => e.ctrlKey && copy())

onKeyStroke(['v'], (e) => e.ctrlKey && paste())

onKeyStroke(['x'], (e) => e.ctrlKey && cut())

onKeyStroke(['d'], (e) => e.ctrlKey && duplicate())
</script>

<template>
    <v-layout use-percentage>
        <v-layout-toolbar class="px-7 border-b border-lines">
            <v-btn mode="text" size="sm" @click="setEntries">
                <v-icon name="rotate" />
            </v-btn>

            <v-menu v-model="menu" offset-y>
                <template #activator="{ attrs }">
                    <v-btn mode="text" size="sm" v-bind="attrs">
                        <v-icon name="plus" />
                    </v-btn>
                </template>

                <v-card color="b-secondary">
                    <v-list-item @click="addFile">
                        {{ $t('addEntity', [$t('file')]) }}
                    </v-list-item>
                    <v-list-item @click="addFolder">
                        {{ $t('addEntity', [$t('folder')]) }}
                    </v-list-item>
                </v-card>
            </v-menu>

            <v-input
                v-model="search"
                :placeholder="$t('search') + '...'"
                class="ml-2 w-full max-w-[300px] mr-4"
                size="sm"
            />
        </v-layout-toolbar>

        <v-layout-content class="overflow-auto h-[calc(100vh_-_45px)]">
            <div v-if="loading" class="flex w-full h-full items-center justify-center">
                <v-icon name="folder" class="text-[5rem] text-t-secondary animate-pulse" />
            </div>

            <v-menu
                v-model="entryMenu.show"
                :x="entryMenu.x"
                :y="entryMenu.y"
                close-on-content-click
            >
                <v-card ref="menuCardRef" color="b-secondary" width="200">
                    <template v-if="entryMenu.item">
                        <v-list-item
                            v-if="selected.length === 1"
                            size="xs"
                            color="info"
                            :to="`/entries/${entryMenu.item?.path}`"
                        >
                            <div class="w-2/12">
                                <v-icon name="eye" />
                            </div>

                            <div class="w-6/12">
                                {{ $t('open') }}
                            </div>

                            <div class="w-4/12">
                                <div class="text-t-secondary">Enter</div>
                            </div>
                        </v-list-item>

                        <v-list-item size="xs" color="info" @click="duplicate">
                            <div class="w-2/12">
                                <v-icon name="clone" />
                            </div>

                            <div class="w-6/12">
                                {{ $t('duplicate', selected.length) }}
                            </div>

                            <div class="text-t-secondary">Ctrl + D</div>
                        </v-list-item>

                        <v-list-item size="xs" color="info" @click="copy">
                            <div class="w-2/12">
                                <v-icon name="copy" />
                            </div>

                            <div class="w-6/12">
                                {{ $t('copy', selected.length) }}
                            </div>

                            <div class="text-t-secondary">Ctrl + C</div>
                        </v-list-item>

                        <v-list-item size="xs" color="info" @click="cut">
                            <div class="w-2/12">
                                <v-icon name="copy" />
                            </div>

                            <div class="w-6/12">
                                {{ $t('cut', selected.length) }}
                            </div>

                            <div class="text-t-secondary">Ctrl + X</div>
                        </v-list-item>

                        <v-list-item size="xs" color="danger" @click="deleteAll">
                            <div class="w-2/12">
                                <v-icon name="trash" />
                            </div>

                            <div class="w-6/12">
                                {{ $t('delete', selected.length) }}
                            </div>

                            <div class="text-t-secondary">Ctrl + C</div>
                        </v-list-item>
                    </template>

                    <template v-else>
                        <v-list-item size="xs" color="info" @click="addFile">
                            <v-icon name="plus" class="mr-2" />
                            {{ $t('newEntity', [$t('file').toLowerCase()]) }}
                        </v-list-item>

                        <v-list-item size="xs" color="info" @click="addFolder">
                            <v-icon name="plus" class="mr-2" />
                            {{ $t('newEntity', [$t('folder').toLowerCase()]) }}
                        </v-list-item>

                        <v-list-item size="xs" color="info" @click="paste">
                            <v-icon name="paste" class="mr-2" />
                            {{ $t('paste') }}
                        </v-list-item>
                    </template>
                </v-card>
            </v-menu>

            <div class="h-full overflow-auto" @contextmenu.prevent="showEntryMenu">
                <v-table
                    ref="tableRef"
                    v-model="selected"
                    :columns="columns"
                    :items="filteredEntries"
                    :fixed="false"
                    header-stick
                    limit="100"
                >
                    <template #item="{ item, index, select }">
                        <v-tr
                            :ref="(el: any) => trRef[index] = el"
                            class="cursor-pointer hover:bg-b-secondary focus:outline-0"
                            :class="[selected.includes(index) ? 'bg-b-secondary' : '']"
                            tabindex="0"
                            @keyup.enter="onEnter(item)"
                            @keydown.f2="editItem = index"
                            @keydown.esc="updateSelection"
                            @dblclick.stop="show(item)"
                            @click="select"
                            @contextmenu.prevent.stop="showEntryMenu($event, item)"
                        >
                            <v-td no-padding>
                                <v-checkbox
                                    :model-value="selected.includes(index)"
                                    class="justify-center"
                                />
                            </v-td>

                            <v-td>
                                <div class="flex">
                                    <div class="w-4 mr-2">
                                        <e-entry-icon :model-value="item" />
                                    </div>

                                    <v-input
                                        v-if="editItem === index"
                                        v-model="item.name"
                                        flat
                                        size="sm"
                                        class="w-full max-w-[70%]"
                                        autofocus
                                    />

                                    <div
                                        v-else
                                        class="text-sm select-none px-4 py-1"
                                        v-text="item.name"
                                    />
                                </div>
                            </v-td>
                        </v-tr>
                    </template>
                </v-table>
            </div>
        </v-layout-content>
    </v-layout>
</template>
