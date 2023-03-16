<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Workspace from '@core/entities/workspace'

import { useStore } from '@store/global'
import { useMeta } from '@composables/metas'

import WForm from '../components/WForm.vue'

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
        label: tm.t('name'),
        name: 'name',
        field: 'name',
    },
    {
        label: tm.t('drive'),
        name: 'driveName',
        field: 'driveName',
    },
    {
        label: tm.t('path'),
        name: 'path',
        field: 'path',
    },
    {
        name: 'actions',
        field: 'actions',
        width: 50,
    },
]

// set meta
const meta = useMeta({
    title: tm.t('listEntity', [tm.t('workspace', 2)]),
})

// load workspaces
const store = useStore()

// form
const dialog = ref(false)
const editedItem = ref<Workspace>()

function closeDialog() {
    dialog.value = false
}

function editItem(workspace: Workspace) {
    editedItem.value = workspace

    dialog.value = true
}

watch(dialog, (v) => {
    if (!v) {
        editedItem.value = undefined
    }
})

// delete workspace

async function deleteItem(id: string) {
    const result = await store.dialog.confirm({
        title: tm.t('areYouSure'),
        message: tm.t('thisActinCanNotBeUndone'),
    })

    if (!result) return

    await store.workspace.destroy(id)

    if (id === store.workspace.currentId) {
        store.workspace.currentId = null
    }
}
</script>
<template>
    <div>
        <v-dialog v-model="dialog">
            <w-form
                color="b-secondary"
                width="500"
                :edited-item="editedItem"
                @created="closeDialog"
                @updated="closeDialog"
            />
        </v-dialog>

        <v-container class="w-full py-2 border-b border-lines flex items-center">
            <v-card-title>
                {{ meta.title }}
            </v-card-title>

            <v-btn class="ml-auto" size="sm" @click="dialog = true">
                {{ $t('addEntity', [$t('workspace')]) }}
            </v-btn>
        </v-container>

        <v-table :columns="columns" :items="store.workspace.workspaces" :fixed="false">
            <template #item-active="{ item }">
                <v-td class="pl-10" no-padding>
                    <v-checkbox
                        :model-value="item.id === store.workspace.currentId"
                        @click="store.workspace.currentId = item.id"
                    />
                </v-td>
            </template>

            <template #item-path="{ item }">
                <v-td>
                    {{ item.config.path }}
                </v-td>
            </template>

            <template #item-actions="{ item }">
                <v-td class="flex pr-7 justify-end">
                    <v-btn size="sm" color="danger" mode="text" @click="editItem(item)">
                        <v-icon name="pen" />
                    </v-btn>

                    <v-btn size="sm" color="danger" mode="text" @click="deleteItem(item.id)">
                        <v-icon name="trash" />
                    </v-btn>
                </v-td>
            </template>
        </v-table>
    </div>
</template>
