<script setup lang="ts">
import Collection from '@core/entities/collection'

import { useCollectionRepository } from '@/composables/collection'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMeta } from '@/composables/metas'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
})

const router = useRouter()
const tm = useI18n()
const repository = useCollectionRepository(props.workspaceId)
const meta = useMeta({
    title: tm.t('listEntity', [tm.t('collection', 2)]),
})

const dialog = ref(false)
const items = ref<Collection[]>([])
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

const payload = ref<any>({
    id: '',
    name: '',
    path: '',
})

async function load() {
    await repository.list().then(({ data }) => (items.value = data))
}

onMounted(load)

async function submit() {
    const { name, path } = payload.value

    await repository.create({
        id: payload.value.id,
        crudName: 'fsFolder',
        name,
        path,
        columns: [],
    })

    await load()

    Object.keys(payload.value).forEach((key) => {
        payload.value[key] = ''
    })
}

async function deleteItem(id: string) {
    await repository.destroy(id)

    await load()
}

async function viewItem(collectionId: string) {
    const { workspaceId } = props

    await router.push(`/workspaces/${workspaceId}/collections/${collectionId}/items`)
}
</script>
<template>
    <div>
        <is-dialog v-model="dialog">
            <is-card color="b-secondary">
                <is-card-head>
                    <is-card-title>
                        {{ $t('addEntity', [$t('collection')]) }}
                    </is-card-title>
                </is-card-head>
                <is-card-content>
                    <w-form class="w-full" @submit="submit">
                        <div class="mb-4">
                            <is-input v-model="payload.id" label="ID" placeholder="collection-01" />
                        </div>

                        <div class="mb-4">
                            <is-input
                                v-model="payload.name"
                                label="Name"
                                placeholder="Collection 01"
                            />
                        </div>

                        <div class="mb-4">
                            <is-input
                                v-model="payload.path"
                                label="Path"
                                placeholder="/collections/collection-01"
                            />
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
                {{ $t('addEntity', [$t('collection')]) }}
            </is-btn>
        </is-container>

        <is-table
            :columns="columns"
            :items="items"
            disable-add-column
            disable-view-item
            disable-new-item
        >
            <template #item-actions="{ item }">
                <div class="flex gap-x-4 p-2">
                    <is-btn text size="sm" @click="viewItem(item.id)">
                        <fa-icon icon="eye" />
                    </is-btn>

                    <is-btn text size="sm" color="danger" @click="deleteItem(item.id)">
                        <fa-icon icon="trash" />
                    </is-btn>
                </div>
            </template>
        </is-table>
    </div>
</template>
