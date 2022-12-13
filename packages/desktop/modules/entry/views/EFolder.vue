<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import orderBy from 'lodash/orderBy'

import { useDirectoryEntry } from '@/composables/directory-entry'
import DirectoryEntry from '@core/entities/directory-entry'
import { definePageMeta } from '@/composables/page-meta'
import { useWorkspace } from '@/stores/workspaces'
import { useI18n } from 'vue-i18n'
import { useStore } from '../store'

const props = defineProps({
    path: {
        type: String,
        default: '/',
    },
})

// const store = useWorkspace()

// const meta = definePageMeta()
// const directoryEntry = useDirectoryEntry(props.workspaceId)

// const workspace = computed(() => store.all.find((w) => w.id === props.workspaceId))

const entriesFormatted = computed(() =>
    orderBy(entries.value, ['type', 'name']).map((e) => {
        let to = `entries/${e.path}`
        let icon = 'file'

        if (e.type === 'directory') {
            // to = `/workspaces/${props.workspaceId}/entry-folder/${e.path}`
            icon = 'folder'
        }

        if (e.name === '.is') {
            icon = 'cog'
        }

        return {
            ...e,
            to,
            icon,
        }
    })
)

const payload = ref({
    name: '',
    type: 'file',
})

async function load() {
    // meta.value.title = (workspace.value?.name || 'workspace') + ' (entries)'
    // await directoryEntry
    //     .list(props.path)
    //     .then(({ data }) => (entries.value = data))
    //     .catch(() => router.push('/404'))
}

watch(props, load, { immediate: true, deep: true })

async function submit() {
    const path = [props.path, payload.value.name]

    let entry = DirectoryEntry.file(...path)

    if (payload.value.type !== 'file') {
        entry = DirectoryEntry.directory(...path)
    }

    // await directoryEntry.create(entry)

    await load()
}

async function deleteEntry(path: string) {
    // await directoryEntry.deleteEntry(path)

    await load()
}

// set items
const store = useStore()
const router = useRouter()

const entries = ref<DirectoryEntry[]>([])

async function setEntries() {
    await store
        .list({ path: props.path })
        .then((r) => (entries.value = r.data))
        .catch(() => router.push('/404'))
}

watch(() => props.path, setEntries, {
    immediate: true,
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
    {
        name: 'actions',
        width: 80,
        padding: {
            right: 40,
        },
    },
]

// get icon

function getIcon(item: DirectoryEntry) {
    let icon = 'file'

    if (item.type === 'directory') {
        // to = `/workspaces/${props.workspaceId}/entry-folder/${e.path}`
        icon = 'folder'
    }

    if (item.name === '.is') {
        icon = 'cog'
    }

    return icon
}
</script>

<template>
    <div class="h-full w-full overflow-auto">
        <v-table :columns="columns" :items="entriesFormatted" :fixed="false" header-stick>
            <template #item="{ item }">
                <v-tr
                    class="cursor-pointer hover:bg-b-secondary"
                    @click="$router.push(`/entries/${item.path}`)"
                >
                    <v-td class="pl-10">
                        <is-icon :name="getIcon(item)" class="mr-4 text-t-secondary" />
                        {{ item.name }}
                    </v-td>

                    <v-td>
                        <v-btn text size="sm" color="danger" @click="deleteEntry(item)">
                            <is-icon name="trash"></is-icon>
                        </v-btn>
                    </v-td>
                </v-tr>
            </template>
        </v-table>
    </div>
    <!-- 
    <div class="h-full w-full">
            
            <is-container class="my-2">
            <v-dialog>
                <template #activator="{ attrs }">
                    <v-btn v-bind="attrs" class="ml-auto">
                        {{ $t('addEntity', [$t('entry')]) }}
                    </v-btn>
                </template>

                <w-form class="w-full mb-4" @submit="submit">
                    <div class="mb-4">
                        <is-input v-model="payload.name" label="Name" placeholder="new-item.txt" />
                    </div>
                    <div class="mb-4">
                        <w-select
                            v-model="payload.type"
                            label="Type"
                            :options="['file', 'directory']"
                        />
                    </div>

                    <w-btn :disabled="!payload.name" class="w-full">add</w-btn>
                </w-form>
            </v-dialog>
        </is-container> -->

    <!-- <div class="flex flex-wrap w-full">
            <div v-if="!entries.length" class="w-full text-center p-3">No items</div>

            <router-link
                v-for="item in entriesFormatted"
                :key="item.name"
                :to="item.to"
                class="flex items-center w-full border-b p-3 text-sm"
            >
                <fa-icon :icon="item.icon" class="mr-4 text-lines" />

                <div>{{ item.name }}</div>

                <div class="grow"></div>

                <div @mousedown.stop="deleteEntry(item.path)">
                    <fa-icon icon="trash" />
                </div>
            </router-link>
        </div> 
    
    </div>
    -->
</template>
