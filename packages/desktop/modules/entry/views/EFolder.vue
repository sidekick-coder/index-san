<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

import DirectoryEntry from '@core/entities/directory-entry'
import { useI18n } from 'vue-i18n'
import { useStore } from '../store'

import LToolbar from '@/modules/layout/components/LToolbar.vue'

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
}

watch(() => props.path, setEntries, {
    immediate: true,
})

// search item
const search = ref('')

const filteredEntries = computed(() => {
    return entries.value.filter((e) => e.name.match(search.value))
})

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

// Get icon

function getIcon(item: DirectoryEntry) {
    let icon = 'file'

    if (item.type === 'directory') {
        icon = 'folder'
    }

    if (item.name === '.is') {
        icon = 'cog'
    }

    return icon
}

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

// update item

async function updateItem(item: DirectoryEntry) {
    await store
        .update({
            newPath: DirectoryEntry.normalize(props.path, item.name),
            path: item.path,
        })
        .catch(() => {
            item.name = DirectoryEntry.basename(item.path)
        })
}

// delete entry

async function deleteEntry(item: DirectoryEntry) {
    const index = entries.value.indexOf(item)

    await store.destroy({ path: item.path })

    entries.value.splice(index, 1)
}
</script>

<template>
    <v-layout use-percentage>
        <l-toolbar>
            <template #default="data">
                <v-btn v-if="!data.drawer.show" text size="sm" @click="data.drawer.toggle">
                    <is-icon name="bars" />
                </v-btn>

                <v-btn
                    :disabled="!data.navigation.haveBack"
                    text
                    size="sm"
                    @click="data.navigation.goBack"
                >
                    <is-icon name="arrow-left" />
                </v-btn>

                <v-btn
                    :disabled="!data.navigation.haveForward"
                    text
                    size="sm"
                    @click="data.navigation.goForward"
                >
                    <is-icon name="arrow-right" />
                </v-btn>

                <v-btn text size="sm" @click="setEntries">
                    <is-icon name="rotate" />
                </v-btn>

                <is-menu v-model="menu" offset-y>
                    <template #activator="{ on }">
                        <v-btn text size="sm" v-bind="on">
                            <is-icon name="plus" />
                        </v-btn>
                    </template>

                    <v-card color="b-secondary">
                        <is-list-item @click="addFile">
                            {{ $t('addEntity', [$t('file')]) }}
                        </is-list-item>
                        <is-list-item @click="addFolder">
                            {{ $t('addEntity', [$t('folder')]) }}
                        </is-list-item>
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

                <is-input
                    v-model="search"
                    placeholder="search"
                    size="sm"
                    class="ml-auto w-full max-w-[300px]"
                    rounded
                    wrapper:class="h-full"
                />

                <v-btn text size="sm" @click="data['toggle-favorite']">
                    <is-icon :name="data['is-favorite'] ? 'star' : 'fa-regular fa-star'" />
                </v-btn>
            </template>
        </l-toolbar>

        <v-layout-content class="overflow-auto h-[calc(100vh_-_45px)]">
            <div v-if="loading" class="flex w-full h-full items-center justify-center">
                <is-icon name="folder" class="text-[5rem] text-t-secondary animate-pulse" />
            </div>

            <div class="h-full overflow-auto">
                <v-table :columns="columns" :items="filteredEntries" :fixed="false" header-stick>
                    <template #item="{ item }">
                        <v-tr
                            class="cursor-pointer hover:bg-b-secondary group"
                            @click="$router.push(`/entries/${item.path}`)"
                        >
                            <v-td class="pl-10 flex pr-7">
                                <div class="w-4 mr-4">
                                    <is-icon :name="getIcon(item)" class="text-t-secondary" />
                                </div>

                                <is-input
                                    v-model="item.name"
                                    flat
                                    size="sm"
                                    class="w-full max-w-[70%]"
                                    @click.prevent.stop
                                    @change="updateItem(item)"
                                />

                                <v-btn
                                    text
                                    size="sm"
                                    color="info"
                                    class="ml-auto text-t-secondary opacity-0 group-hover:opacity-100"
                                    :to="`/entries/${item.path}`"
                                >
                                    <is-icon name="eye"></is-icon>
                                </v-btn>

                                <v-btn
                                    text
                                    size="sm"
                                    color="danger"
                                    class="text-t-secondary opacity-0 group-hover:opacity-100"
                                    @click.prevent.stop="deleteEntry(item)"
                                >
                                    <is-icon name="trash"></is-icon>
                                </v-btn>
                            </v-td>
                        </v-tr>
                    </template>
                </v-table>
            </div>
        </v-layout-content>
    </v-layout>
</template>
