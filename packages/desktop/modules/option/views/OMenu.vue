<script setup lang="ts">
import { useMeta } from '@/composables/metas'
import { useStore, Menu } from '@/modules/menu/store'

// metas
useMeta({ title: 'Menu settings' })

const store = useStore()

// Table columns
const columns = [
    {
        name: 'order',
        label: 'Order',
        field: 'order',
        width: 80,
        padding: {
            left: 40,
        },
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
    // await useAllMenuAsync()
}

async function onItemUpdate() {
    await store.save()
    // await update(item.workspace.id)
    // await setItems()
}

async function onItemDelete(item: Menu) {
    const index = store.menu.indexOf(item)

    if (index !== -1) {
        store.menu.splice(index, 1)

        // await store.save()
    }
}

setItems()
</script>
<template>
    <div>
        <is-table :columns="columns" :items="store.menu" limit="100" :fixed="false">
            <template #item-order="{ item, column }">
                <is-input
                    v-model="item[column.field]"
                    type="number"
                    flat
                    input:class="pl-10 w-[80px]"
                    @change="onItemUpdate"
                />
            </template>

            <template #item-label="{ item, column }">
                <is-input v-model="item[column.field]" flat @change="onItemUpdate" />
            </template>

            <template #item-section="{ item, column }">
                <is-input v-model="item[column.field]" flat @change="onItemUpdate" />
            </template>

            <template #item-icon="{ item, column }">
                <is-input v-model="item[column.field]" flat @change="onItemUpdate" />
            </template>

            <template #item-actions="{ item, attrs }">
                <div v-bind="attrs" class="flex items-center justify-center">
                    <v-btn color="danger" text size="sm" @click="store.destroy(item)">
                        <is-icon name="trash" class="cursor-pointer" />
                    </v-btn>
                </div>
            </template>
        </is-table>
    </div>
</template>
