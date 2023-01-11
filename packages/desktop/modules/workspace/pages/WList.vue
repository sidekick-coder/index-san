<script setup lang="ts">
import { useMeta } from '@/composables/metas'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../store'

// set columns
const tm = useI18n()

const columns = [
    {
        name: 'active',
        width: 80,
        padding: {
            left: 40,
        },
    },
    {
        label: 'Id',
        name: 'id',
        field: 'id',
    },
    {
        label: tm.t('name'),
        name: 'name',
        field: 'name',
    },
    {
        label: tm.t('path'),
        name: 'path',
        field: 'path',
    },
    {
        name: 'actions',
        field: 'actions',
        width: 100,
    },
]

// set meta
const meta = useMeta({
    title: tm.t('listEntity', [tm.t('workspace', 2)]),
})

// load workspaces
const store = useStore()

store.setWorkspaces()

// create new workspace
const dialog = ref(false)

const payload = ref<any>({
    id: '',
    name: '',
    path: '',
})

async function submit() {
    await store.create({
        id: payload.value.id,
        name: payload.value.name,
        driveName: 'fs',
        config: {
            path: payload.value.path,
        },
    })

    await store.setWorkspaces()

    Object.keys(payload.value).forEach((key) => {
        payload.value[key] = ''
    })

    dialog.value = false
}

// delete workspace

async function deleteItem(id: string) {
    await store.destroy(id)

    await store.setWorkspaces()
}
</script>
<template>
    <v-dialog v-model="dialog">
        <v-card color="b-secondary" width="500">
            <v-card-head class="px-4">
                <v-card-title>
                    {{ $t('addEntity', [$t('workspace').toLocaleLowerCase()]) }}
                </v-card-title>
            </v-card-head>
            <v-card-content>
                <w-form class="mb-4 w-full" @submit="submit">
                    <div class="mb-4">
                        <v-input v-model="payload.id" label="Id" />
                    </div>

                    <div class="mb-4">
                        <v-input v-model="payload.name" label="Name" />
                    </div>

                    <div class="mb-4">
                        <v-input v-model="payload.path" label="Path" />
                    </div>

                    <v-btn :disabled="!payload.name || !payload.path" class="w-full" type="submit">
                        {{ $t('create') }}
                    </v-btn>
                </w-form>
            </v-card-content>
        </v-card>
    </v-dialog>

    <v-container class="w-full py-4 border-b border-lines flex items-center">
        <div class="text-2xl font-bold">
            {{ meta.title }}
        </div>
        <v-btn class="ml-auto" @click="dialog = true">
            {{ $t('addEntity', [$t('workspace')]) }}
        </v-btn>
    </v-container>

    <v-table :columns="columns" :items="store.workspaces" :fixed="false">
        <template #item-active="{ item }">
            <v-td class="pl-10">
                <v-checkbox
                    :model-value="item.id === store.currentId"
                    @click="store.currentId = item.id"
                />
            </v-td>
        </template>

        <template #item-path="{ item }">
            <v-td>
                {{ item.config.path }}
            </v-td>
        </template>

        <template #item-actions="{ item }">
            <v-td class="flex gap-x-2 pr-10 justify-end">
                <v-btn size="sm" color="b-secondary" @click="deleteItem(item.id)">
                    <fa-icon icon="trash" />
                </v-btn>
            </v-td>
        </template>
    </v-table>
</template>
