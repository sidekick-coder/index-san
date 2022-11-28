<script setup lang="ts">
import { definePageMeta } from '@/composables/page-meta'
import {
    useAllMenu,
    useAllMenuAsync,
    saveWorkspaceMenu,
    MenuItemWithWorkspace,
} from '@/composables/menu'

definePageMeta({
    title: 'Menu settings',
})

const menu = useAllMenu()

const columns = [
    {
        name: 'order',
        label: 'Order',
        field: 'order',
        width: 120,
        padding: {
            left: 40,
        },
    },
    {
        name: 'workspace',
        label: 'Workspace',
        field: 'workspace',
    },
    {
        name: 'label',
        label: 'Label',
        field: 'label',
    },
    {
        name: 'section',
        label: 'section',
        field: 'section',
    },
    {
        name: 'icon',
        label: 'icon',
        field: 'icon',
    },
    {
        name: 'actions',
        label: '',
        width: 120,
        padding: {
            right: 40,
        },
    },
]

async function setItems() {
    await useAllMenuAsync()
}

async function update(workspaceId: string) {
    const items = menu.value.filter((m) => m.workspace.id === workspaceId)

    await saveWorkspaceMenu(workspaceId, items)
}

async function onItemUpdate(item: MenuItemWithWorkspace) {
    await update(item.workspace.id)

    await setItems()
}

async function onItemDelete(item: MenuItemWithWorkspace) {
    const items = menu.value
        .filter((m) => m.workspace.id === item.workspace.id)
        .filter((m) => m.id !== item.id)

    await saveWorkspaceMenu(item.workspace.id, items)

    await setItems()
}

setItems()
</script>
<template>
    <div>
        <is-table :columns="columns" :items="menu" limit="100" :fixed="false">
            <template #item-order="{ item, column, attrs }">
                <div v-bind="attrs">
                    <is-input
                        v-model="item[column.field]"
                        type="number"
                        flat
                        @change="onItemUpdate(item)"
                    />
                </div>
            </template>

            <template #item-workspace="{ item }">
                <div class="p-2">
                    {{ item.workspace.name }}
                </div>
            </template>

            <template #item-label="{ item, column }">
                <is-input v-model="item[column.field]" flat @change="onItemUpdate(item)" />
            </template>

            <template #item-section="{ item, column }">
                <is-input v-model="item[column.field]" flat @change="onItemUpdate(item)" />
            </template>

            <template #item-icon="{ item, column }">
                <is-input v-model="item[column.field]" flat @change="onItemUpdate(item)" />
            </template>

            <template #item-actions="{ item, attrs }">
                <div v-bind="attrs" class="flex items-center justify-center">
                    <is-btn color="danger" text size="sm">
                        <is-icon name="trash" class="cursor-pointer" @click="onItemDelete(item)" />
                    </is-btn>
                </div>
            </template>
        </is-table>
    </div>
</template>
