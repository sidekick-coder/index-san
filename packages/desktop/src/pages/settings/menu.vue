<script setup lang="ts">
import { definePageMeta } from '@/composables/page-meta'
import { useOptionStore, MenuItem } from '@/stores/options'
import { some } from 'lodash'
import { ref } from 'vue'

const store = useOptionStore()

definePageMeta({
    title: 'Menu settings'
})

const items = ref<MenuItem[]>([])

const columns = [
    {
        name: 'sort',
        label: 'Order',
        field: 'sort'
    },
    {
        name: 'label',
        label: 'Label',
        field: 'label'
    },
    {
        name: 'to',
        label: 'To',
        field: 'to'
    },
    {
        name: 'icon',
        label: 'icon',
        field: 'icon'
    },
]

async function setItems(){
    await store.load()

    items.value = store.menuItems.slice()
}

async function update(workspaceId: string){
    const option = {
        menu: {
            items: items.value
        }
    }

    await store.update(workspaceId, option)

    await setItems()
}

async function onItemUpdate(item: MenuItem){    
    await update(item.workspaceId)
}
async function onItemDelete(item: MenuItem){
    const index = items.value.findIndex(i => i.id === item.id)

    if (index === -1) {
        return
    }

    items.value.splice(index, 1)

    await update(item.workspaceId)
}

setItems()

async function move(item: MenuItem, count = 1) {
    const index = items.value.findIndex(i => i.id === item.id)

    if (index === -1) {
        return
    }

    if (index === 0 && count === -1) return
    if (index === items.value.length - 1 && count === 1) return

    items.value.splice(index, 1)
    
    items.value.splice(index + count, 0, item)

    await update(item.workspaceId)
}


</script>
<template>
    <is-table
        :columns="columns"
        :items="items"
        disable-add-column
        disable-view-item
        disable-new-item
        @item:update="onItemUpdate"
        @item:delete="onItemDelete"
    >

        <template #item-sort="{ item }">
            <is-icon @click="move(item, -1)" name="arrow-up" class="cursor-pointer text-sm mr-2" />
            <is-icon @click="move(item)" name="arrow-down" class="cursor-pointer text-sm" />
        </template>

    </is-table>
</template>