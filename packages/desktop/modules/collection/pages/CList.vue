<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useMeta } from '@/composables/metas'
import { useStore } from '@/modules/collection/store'

const tm = useI18n()

const meta = useMeta({
    title: tm.t('listEntity', [tm.t('collection', 2)]),
})

const dialog = ref(false)
const columns = [
    {
        label: 'ID',
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

// set collections
const store = useStore()

// create new collection
const payload = ref({
    id: '',
    name: '',
    path: '',
})

async function submit() {
    await store.create({
        data: {
            id: payload.value.id,
            crudName: 'fsFolder',
            name: payload.value.name,
            path: payload.value.path,
            columns: [],
            views: [],
        },
    })

    Object.keys(payload.value).forEach((key) => {
        payload.value[key] = ''
    })
}

// Delete collection
async function deleteItem(collectionId: string) {
    await store.destroy({ collectionId })
}
</script>
<template>
    <div>
        <v-dialog v-model="dialog">
            <v-card color="b-secondary" width="500">
                <v-card-head>
                    <v-card-title>
                        {{ $t('addEntity', [$t('collection')]) }}
                    </v-card-title>
                </v-card-head>
                <v-card-content>
                    <w-form class="w-full" @submit="submit">
                        <div class="mb-4">
                            <v-input v-model="payload.id" label="ID" placeholder="collection-01" />
                        </div>

                        <div class="mb-4">
                            <v-input
                                v-model="payload.name"
                                label="Name"
                                placeholder="Collection 01"
                            />
                        </div>

                        <div class="mb-4">
                            <v-input
                                v-model="payload.path"
                                label="Path"
                                placeholder="/collections/collection-01"
                            />
                        </div>

                        <v-btn :disabled="!payload.name || !payload.path" class="w-full">
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
                {{ $t('addEntity', [$t('collection')]) }}
            </v-btn>
        </v-container>

        <v-table
            :columns="columns"
            :items="store.collections"
            disable-add-column
            disable-view-item
            disable-new-item
        >
            <template #item-actions="{ item }">
                <v-td class="flex gap-x-4 p-2">
                    <v-btn text size="sm" :to="`/collections/${item.id}/items`">
                        <fa-icon icon="eye" />
                    </v-btn>

                    <v-btn text size="sm" color="danger" @click="deleteItem(item.id)">
                        <fa-icon icon="trash" />
                    </v-btn>
                </v-td>
            </template>
        </v-table>
    </div>
</template>
