<script setup lang="ts">
import { useMeta } from '@/composables/metas'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../store'

const store = useStore()
const tm = useI18n()

const columns = [
    {
        label: 'Id',
        name: 'id',
        field: 'id',
        padding: {
            left: 40,
        },
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
    },
]

const dialog = ref(false)

const payload = ref<any>({
    id: '',
    name: '',
    path: '',
})

const meta = useMeta({
    title: tm.t('listEntity', [tm.t('workspace', 2)]),
})

function load() {
    return store.setAll()
}

load()

async function submit() {
    await store.create({
        id: payload.value.id,
        name: payload.value.name,
        driveName: 'fs',
        config: {
            path: payload.value.path,
        },
    })

    await load()

    Object.keys(payload.value).forEach((key) => {
        payload.value[key] = ''
    })

    dialog.value = false
}

async function deleteItem(id: string) {
    await store.delete(id)

    load()
}
</script>
<template>
    <div>
        <is-dialog v-model="dialog">
            <is-card color="b-secondary">
                <is-card-head>
                    <is-card-title>
                        {{ $t('addEntity', [$t('workspace').toLocaleLowerCase()]) }}
                    </is-card-title>
                </is-card-head>
                <is-card-content>
                    <w-form class="mb-4 w-full" @submit="submit">
                        <div class="mb-4">
                            <is-input v-model="payload.id" label="Id" />
                        </div>

                        <div class="mb-4">
                            <is-input v-model="payload.name" label="Name" />
                        </div>

                        <div class="mb-4">
                            <is-input v-model="payload.path" label="Path" />
                        </div>

                        <is-btn :disabled="!payload.name || !payload.path" class="w-full">
                            {{ $t('create') }}
                        </is-btn>
                    </w-form>
                </is-card-content>
            </is-card>
        </is-dialog>

        <is-container class="w-full py-5 border-b border-lines flex items-center">
            <div class="text-2xl font-bold">
                {{ meta.title }}
            </div>
            <is-btn class="ml-auto" @click="dialog = true">
                {{ $t('addEntity', [$t('workspace')]) }}
            </is-btn>
        </is-container>

        <is-table :columns="columns" :items="store.all" :fixed="false">
            <template #item-path="{ item }">
                <div class="p-2">
                    {{ item.config.path }}
                </div>
            </template>

            <template #item-actions="{ item }">
                <div class="flex gap-x-2 p-2">
                    <is-btn
                        size="sm"
                        text
                        class="mr-2"
                        @click="$router.push(`/workspaces/${item.id}/scripts`)"
                    >
                        <is-icon name="code" />
                    </is-btn>

                    <is-btn
                        size="sm"
                        text
                        class="mr-2"
                        @click="$router.push(`/workspaces/${item.id}/collections`)"
                    >
                        <is-icon name="database" />
                    </is-btn>

                    <is-btn size="sm" text class="mr-2" :to="`/workspaces/${item.id}/entries`">
                        <is-icon name="folder" />
                    </is-btn>

                    <is-btn size="sm" text color="danger" @click="deleteItem(item.id)">
                        <fa-icon icon="trash" />
                    </is-btn>
                </div>
            </template>
        </is-table>
    </div>
</template>
