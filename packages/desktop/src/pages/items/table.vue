<script lang="ts" setup>
import { computed, ref } from 'vue'
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
const dialog = ref(false)

const columns = computed(() => {
    const collectionColumns: any[] = collection.value?.columns?.slice() || []

    collectionColumns.push({
        field: '',
        id: 'new-column',
        hide: true
    })

    return collectionColumns
})

async function load(){
    await repository.show(props.collectionId).then(d => collection.value = d.data)    

    await crud.list().then(d => items.value = d.data)
}

load()

async function addNew() {
    await crud.create()

    await load()
}

async function updateItem(itemId: string, field: string, value: string) {
    await crud.update(itemId, { [field]: value })
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
    
    dialog.value = false

    await load()
}

async function deleteColumn(id: string) {
    
    const allColumns = collection.value.columns?.slice() || []
    
    const index = allColumns.findIndex(c => c.id === id)

    if (index === -1) return

    allColumns.splice(index, 1)

    await repository.update(props.collectionId, {
        columns: allColumns
    })

    await load()
}

</script>
<template>
    <div class="p-5">

        <column-dialog v-model="dialog" @submit="createColumn" />

        <div class="text-2xl mb-10">
            {{ collection.name ?? 'Collection' }}
        </div>

        <is-table
            :items="items"
            :columns="columns"
        >

            <template #column="{ column, classes }">
                <th v-if="column.id !== 'new-column' " :class="classes">
                    <div class="flex items-center">

                        <div> {{ column.label }}</div>


                        <div class="grow"></div>

                        <i
                            @click="deleteColumn(column.id)"
                            class="w-5 h-5 hover:bg-gray-600 flex items-center justify-center cursor-pointer">
                            <fa-icon icon="trash" class="text-xs " />
                        </i>

                        
                    </div>
                </th>
                
                <th
                    v-else :class="classes"
                    class="cursor-pointer text-sm"
                    @click="dialog = true"
                >
                    <fa-icon icon="plus" />
                </th>
            </template>

            <template #item="{ item, classes }">
                <tr :class="classes">
                    <td
                        v-for="(column, cIndex) in columns.filter(c => !c.hide)"
                        :key="cIndex"
                        class="border"
                    >
                        <div v-if="!column.field" />
                    
                        <input
                            v-else
                            v-model="item[column.field]"
                            class="p-2 bg-transparent hover:bg-gray-600 focus:outline focus:outline-2 focus:outline-teal-500 focus:bg-gray-600 w-full"
                            :disabled="column.readonly"
                            @change="(e) => updateItem(item.id, column.field, (e.target as any).value)"
                            @keyup.shift.enter="$emit('items:new')"
                        >

                    </td>

                    <td class="border p-2"></td>
                </tr>
            </template>


            <template #body-append>
                <tr>
                    <td
                        class="border p-2 cursor-pointer hover:bg-gray-700 text-sm"
                        :colspan="columns.length + 1"
                        @click="addNew"
                    >
                        <fa-icon icon="plus" class="mr-2" />

                        <span>New</span>

                    </td>
                </tr>
            </template>


        </is-table>
    </div>
</template>