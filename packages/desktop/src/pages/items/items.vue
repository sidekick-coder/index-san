<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import uuid from 'uuid-random'

import Collection from '@core/entities/collection'
import Item from '@core/entities/item'

import { useCrud } from '@/composables/crud'

import ColumnDialog from './table-column-dialog.vue'

import { useCollectionRepository } from '@/composables/collection'

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
const repository = useCollectionRepository(props.workspaceId)

const collection = ref<Partial<Collection>>({})
const items = ref<Item[]>([])
const dialog = ref({
    column: false,
    item: false
})
const editedItem = ref<Partial<Item>>({})

const columns = computed(() => collection.value?.columns?.slice() || [])

async function load(){
    await repository.show(props.collectionId).then(d => collection.value = d.data)    

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

async function createColumn(column: any) {
    const payload = {
        ...column,
        id: uuid(),
    }

    const allColumns = collection.value.columns?.slice() || []

    allColumns.push(payload)

    await repository.update(props.collectionId, {
        columns: allColumns
    })
    
    dialog.value.column = false

    await load()
}

async function deleteColumn(id: string) {

    const confirmation = confirm('delete column?')

    if (!confirmation) return
    
    const allColumns = collection.value.columns?.slice() || []
    
    const index = allColumns.findIndex(c => c.id === id)

    if (index === -1) return

    allColumns.splice(index, 1)

    await repository.update(props.collectionId, {
        columns: allColumns
    })

    await load()
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

</script>
<template>
    <div class="p-5">

        <item-dialog
            v-model="dialog.item"
            :columns="columns"
            :item="editedItem"
            @save="saveEditedItem"
            @delete="deleteItem(editedItem.id)"
        />

        <column-dialog v-model="dialog.column" @submit="createColumn" />

        <div class="text-2xl mb-5">
            {{ collection.name ?? 'Collection' }}
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
            @column:update="deleteColumn"
        />

    </div>
</template>