<script lang="ts" setup>
import { ref, watch } from 'vue'

import { CollectionColumn } from '@core/entities/collection'
import Item from '@core/entities/item'

import { useCrud } from '@/composables/crud'

import { useCollection } from '@/composables/collection'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    collectionId: {
        type: String,
        required: true,
    }
})

const crud = useCrud(props.workspaceId, props.collectionId)
const collection = useCollection(props.workspaceId, props.collectionId)

const title = ref('Collection')

const items = ref<Item[]>([])
const dialog = ref({
    column: false,
    item: false
})
const editedItem = ref<Partial<Item>>({})
const editedColumn = ref<CollectionColumn | null>(null)

const columns = ref<CollectionColumn[]>([])

async function load(){
    const response = await collection.show()
    
    title.value = response.name
    columns.value = response.columns

    await crud.list().then(d => items.value = d.data)
}

load()

async function addNew() {
    await crud.create()

    await load()
}

async function updateItem({ id, data }: { data: any, id: string }) {
    await crud.update(id, data)
}

async function deleteItem(id: string) {
    await crud.destroy(id)

    await load()

    dialog.value.item = false
}

async function edit(item: Item) {
    editedItem.value = item
    dialog.value.item = true
}

async function saveEditedItem(data: any){
    await updateItem({ id: editedItem.value.id!, data })

    await load()
}

watch(editedColumn, v => v ? (dialog.value.column = true) : null)

</script>
<template>
    <div class="p-5">

        <is-item-dialog
            v-model="dialog.item"
            :columns="columns"
            :item="editedItem"
            @save="saveEditedItem"
            @delete="deleteItem(editedItem.id!)"
        />

        <is-column-dialog
            v-model="dialog.column"
            v-model:column="editedColumn"
            :workspace-id="workspaceId"
            :collection-id="collectionId"
            @save="load"
        />

        <div class="text-2xl mb-5">
            {{ title }}
        </div>

        <data-view
            :items="items"
            :columns="columns"
            
            @item:new="addNew"
            @item:show="edit"
            @item:update="updateItem"
            @item:delete="deleteItem"
            @item:refresh="load"

            @column:new="dialog.column = true"
            @column:update="(c: CollectionColumn) => editedColumn = c"
        />

    </div>
</template>