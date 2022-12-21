<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

import DirectoryEntry from '@core/entities/directory-entry'
import { useI18n } from 'vue-i18n'
import { useStore } from '../store'

import VTr from '@/components/v-tr.vue'
import LToolbar from '@/modules/layout/components/LToolbar.vue'
import EEntryIcon from '../components/EEntryIcon.vue'
import { onKeyStroke } from '@vueuse/core'

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
        padding: {
            left: 40,
        },
    },
]

// create entries

const menu = ref(false)

function createFilename(prefix = 'New') {
    let count = 0

    entries.value.forEach((e) => {
        if (count === 0 && e.name === prefix) {
            count++
            return
        }

        if (e.name === `${prefix} (${count})`) {
            count++
        }
    })

    if (count === 0) {
        return prefix
    }

    return `${prefix} (${count})`
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
const trRef = ref<InstanceType<typeof VTr>[]>([])

function onSelect(e: MouseEvent, itemIndex: number) {
    if (!e.ctrlKey && !e.shiftKey) {
        selected.value = [itemIndex]
        return
    }

    if (e.ctrlKey) {
        selected.value.push(itemIndex)
        return
    }

    const selectedIndex = selected.value[0]

    if (itemIndex > selectedIndex) {
        selected.value = entries.value
            .map((e, index) => index)
            .filter((index) => index <= itemIndex)
            .filter((index) => index >= selectedIndex)
    }

    if (itemIndex < selectedIndex) {
        selected.value = entries.value
            .map((e, index) => index)
            .filter((index) => index >= itemIndex)
            .filter((index) => index <= selectedIndex)
    }
}

function updateSelection() {
    if (selected.value.length !== 1) return

    const index = selected.value[0]

    if (trRef.value[index]) {
        trRef.value[index].$el?.focus()
    }
}

watch(selected, updateSelection)

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

// update item

const editItem = ref<number>()

async function updateItem(item: DirectoryEntry) {
    const newPath = DirectoryEntry.normalize(props.path, item.name)

    const index = editItem.value

    if (!index) return

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
}

watch(selected, () => (editItem.value = undefined))

// show

function show(item: DirectoryEntry) {
    if (editItem.value) return

    router.push(`/entries/${item.path}`)
}
</script>

<template>
    <v-layout use-percentage>
        <l-toolbar>
            <template #default="data">
                <v-btn v-if="!data.drawer.show" text size="sm" @click="data.drawer.toggle">
                    <v-icon name="bars" />
                </v-btn>

                <v-btn
                    :disabled="!data.navigation.haveBack"
                    text
                    size="sm"
                    @click="data.navigation.goBack"
                >
                    <v-icon name="arrow-left" />
                </v-btn>

                <v-btn
                    :disabled="!data.navigation.haveForward"
                    text
                    size="sm"
                    @click="data.navigation.goForward"
                >
                    <v-icon name="arrow-right" />
                </v-btn>

                <v-btn text size="sm" @click="setEntries">
                    <v-icon name="rotate" />
                </v-btn>

                <is-menu v-model="menu" offset-y>
                    <template #activator="{ on }">
                        <v-btn text size="sm" v-bind="on">
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
                </is-menu>

                <template v-for="(link, index) in data.links" :key="index">
                    <v-btn v-if="link.to" size="sm" text :to="link.to">
                        {{ link.label }}
                    </v-btn>

                    <div v-else class="text-xs px-3 py-1" v-text="link.label" />

                    <div
                        v-if="data.links.length >= 2 && index !== data.links.length - 1"
                        class="px-1"
                    >
                        /
                    </div>
                </template>

                <v-input
                    v-model="search"
                    placeholder="search"
                    size="sm"
                    class="ml-auto w-full max-w-[300px]"
                    rounded
                    wrapper:class="h-full"
                />

                <v-btn text size="sm" @click="data.menu.toggle">
                    <v-icon :name="data.menu.item ? 'star' : 'fa-regular fa-star'" />
                </v-btn>
            </template>
        </l-toolbar>

        <v-layout-content class="overflow-auto h-[calc(100vh_-_45px)]">
            <div v-if="loading" class="flex w-full h-full items-center justify-center">
                <v-icon name="folder" class="text-[5rem] text-t-secondary animate-pulse" />
            </div>

            <div class="h-full overflow-auto">
                <v-table :columns="columns" :items="filteredEntries" :fixed="false" header-stick>
                    <template #item="{ item, index }">
                        <v-tr
                            :ref="(el: any) => trRef[index] = el"
                            class="cursor-pointer hover:bg-b-secondary group focus:outline-0"
                            :class="[selected.includes(index) ? 'bg-b-secondary' : '']"
                            tabindex="0"
                            @dblclick="show(item)"
                            @click="onSelect($event, index)"
                            @keydown.enter="show(item)"
                            @keydown.f2="editItem = index"
                            @keydown.esc="updateSelection"
                            @mousedown.prevent
                        >
                            <v-td class="pl-10 flex pr-7">
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
                                    @keypress.enter="updateItem(item)"
                                />

                                <div
                                    v-else
                                    class="text-sm select-none px-4 py-1"
                                    v-text="item.name"
                                />

                                <v-btn
                                    text
                                    size="sm"
                                    color="info"
                                    class="ml-auto text-t-secondary opacity-0 group-hover:opacity-100"
                                    :to="`/entries/${item.path}`"
                                >
                                    <v-icon name="eye"></v-icon>
                                </v-btn>

                                <v-btn
                                    text
                                    size="sm"
                                    color="danger"
                                    class="text-t-secondary opacity-0 group-hover:opacity-100"
                                    @click.prevent.stop="deleteEntry(item)"
                                >
                                    <v-icon name="trash"></v-icon>
                                </v-btn>
                            </v-td>
                        </v-tr>
                    </template>
                </v-table>
            </div>
        </v-layout-content>
    </v-layout>
</template>
