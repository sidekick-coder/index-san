<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Collection from '@index-san/core/entities/collection'

import { useMeta } from '@composables/metas'
import { useStore } from '@store/global'

import CForm from '@modules/collection/components/CForm.vue'

import { useRouter } from 'vue-router'

const tm = useI18n()

const meta = useMeta({
    title: tm.t('listEntity', [tm.t('collection', 2)]),
})

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
        label: tm.t('repositoryType'),
        name: 'repositoryType',
        field: 'repositoryType',
    },
    {
        label: tm.t('path'),
        name: 'path',
        field: 'path',
    },
    {
        name: 'actions',
        field: 'actions',
        width: 150,
    },
]

// collections
const store = useStore()

onMounted(store.collection.setCollections)

// form
const router = useRouter()

const dialog = ref(false)
const editedItem = ref<Collection>()

async function onCreate(collection: Collection) {
    dialog.value = false

    await router.push(`/collections/${collection.id}/items`)
}

async function onUpdated() {
    dialog.value = false
}

function editCollection(collection: Collection) {
    editedItem.value = collection
    dialog.value = true
}

watch(dialog, (value) => {
    if (!value) {
        editedItem.value = undefined
    }
})

// destroy
async function deleteItem(id: string) {
    const result = await store.dialog.confirm({
        title: tm.t('areYouSure'),
        message: tm.t('thisActinCanNotBeUndone'),
    })

    if (!result) return

    await store.collection.destroy(id)
}
</script>
<template>
    <div>
        <v-dialog v-model="dialog">
            <c-form
                :edited-item="editedItem"
                @created="onCreate"
                @updated="onUpdated"
            />
        </v-dialog>

        <v-container class="w-full border-b py-2 border-lines flex items-center">
            <v-card-title>
                {{ meta.title }}
            </v-card-title>

            <v-btn
                class="ml-auto"
                size="sm"
                @click="dialog = true"
            >
                {{ $t('addEntity', [$t('collection')]) }}
            </v-btn>
        </v-container>

        <v-table
            :columns="columns"
            :items="store.collection.collections"
            :fixed="false"
        >
            <template #item-actions="{ item }">
                <v-td class="flex justify-end pr-7">
                    <v-btn
                        mode="text"
                        size="sm"
                        :to="`/collections/${item.id}/items`"
                    >
                        <fa-icon icon="eye" />
                    </v-btn>

                    <v-btn
                        mode="text"
                        size="sm"
                        @click="editCollection(item)"
                    >
                        <fa-icon icon="pen" />
                    </v-btn>

                    <v-btn
                        mode="text"
                        size="sm"
                        color="danger"
                        @click="deleteItem(item.id)"
                    >
                        <fa-icon icon="trash" />
                    </v-btn>
                </v-td>
            </template>
        </v-table>
    </div>
</template>
