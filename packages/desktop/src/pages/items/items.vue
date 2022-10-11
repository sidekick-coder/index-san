<script lang="ts" setup>
import { ref, watch } from 'vue'

import { CollectionColumn } from '@core/entities/collection'
import Item from '@core/entities/item'

import { useCrud } from '@/composables/crud'

import { useCollection } from '@/composables/collection'
import { definePageMeta } from '@/composables/page-meta'

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

const meta = definePageMeta({ layout: 'workspace' })
const crud = useCrud(props.workspaceId, props.collectionId)
const collection = useCollection(props.workspaceId, props.collectionId)

const items = ref<Item[]>([])
const dialog = ref({
    column: false,
    item: false
})
const editedItem = ref<Item>()
const editedColumn = ref<CollectionColumn | null>(null)

const columns = ref<CollectionColumn[]>([])

async function load(){
    const response = await collection.show()
    meta.value.title = response.name
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

async function show(item: Item) {
    editedItem.value = item
    dialog.value.item = true
}

watch(editedColumn, v => v ? (dialog.value.column = true) : null)

</script>
<template>
    <div class="p-5">

        <is-dialog v-model="dialog.item">

            <template v-if="dialog.item">            
                <div>
                    <is-item-form
                        :workspace-id="workspaceId"
                        :collection-id="collectionId"
                        :item-id="editedItem?.id"
                        @save="load"
                    />
                </div>
                
                <div class="my-4 bg-gray-600 h-[1px] w-full"></div>
    
                <is-item-content
                    :workspace-id="workspaceId"
                    :collection-id="collectionId"
                    :item-id="editedItem?.id"
                    class="h-[40vh]" 
                />
            </template>            

        </is-dialog>

        <is-column-dialog
            v-model="dialog.column"
            v-model:column="editedColumn"
            :workspace-id="workspaceId"
            :collection-id="collectionId"
            @save="load"
        />

        <is-data-view
            :items="items"
            :columns="columns"
            
            @item:new="addNew"
            @item:show="show"
            @item:update="updateItem"
            @item:delete="deleteItem"
            @item:refresh="load"

            @column:new="dialog.column = true"
            @column:update="(c: CollectionColumn) => editedColumn = c"
        />

    </div>
</template>