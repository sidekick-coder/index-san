<script lang="ts" setup>
import { computed, ref } from 'vue'

import Collection from '@core/entities/collection'
import Item from '@core/entities/item'

import { useCrud } from '@/composables/crud'

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

const active = ref([-1, -1])
const collection = ref<Partial<Collection>>({})
const items = ref<Item[]>([])

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
    await crud.getCollection().then(d => collection.value = d.data)    

    await crud.list().then(d => items.value = d.data)
}

load()

function isActive(itemIndex: number, columnIndex: number, ) {
    return active.value[0] == itemIndex && active.value[1] === columnIndex
}

function setActive(itemIndex: number, columnIndex: number, ) {
    active.value[0] = itemIndex
    active.value[1] = columnIndex
}

function unsetActive(index: number, columnIndex: number) {
    setTimeout(() => {
        if (isActive(index, columnIndex)) active.value = [-1, -1]
    }, 100)
}

async function addNew() {
    await crud.create()

    await load()
}

async function updateItem(itemId: string, field: string, value: string) {
    await crud.update(itemId, { [field]: value })
}

</script>
<template>
    <div class="p-5">
        <div class="text-2xl mb-10">
            {{ collection.name ?? 'Collection' }}
        </div>

        <is-table
            :items="items"
            :columns="columns"
        >

            <template #column="{ column, classes }">
                <th v-if="column.id !== 'new-column' " :class="classes">
                        {{ column.label }}
                </th>
                
                <th v-else :class="classes" class="cursor-pointer text-sm">
                    <fa-icon icon="plus" />
                </th>
            </template>

            <template #item="{ item, index, classes }">
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
                            :class="isActive(index, cIndex) ? 'cursor-auto' : 'cursor-default'"
                            :disabled="column.readonly"
                            @change="(e) => updateItem(item.id, column.field, (e.target as any).value)"
                            @focus="setActive(index, cIndex)"
                            @blur="unsetActive(index, cIndex)"
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