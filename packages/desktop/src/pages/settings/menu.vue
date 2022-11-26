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
        width: 80,
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
        width: 80,
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
    <is-table :columns="columns" :items="menu" limit="100">
        <template #item-order="{ item, column }">
            <is-input v-model="item[column.field]" flat @change="onItemUpdate(item)" />
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

        <template #item-actions="{ item }">
            <div class="flex items-center justify-center">
                <is-icon name="trash" class="cursor-pointer" @click="onItemDelete(item)" />
            </div>
        </template>
    </is-table>
</template>
