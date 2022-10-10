<script lang="ts" setup>    
defineProps({
    items: {
        type: Array as () => any[],
        default: () => []
    },
    columns: {
        type: Array as () => any[],
        default: () => []
    },
})

const emit = defineEmits([
    'column:new',
    'column:update',
    'item:show',
    'item:new',
    'item:update',
    'item:delete',
    'item:refresh'
])
    
async function updateItem(itemId: string, field: string, value: string) {
    emit('item:update', {
        id: itemId,
        data: {
            [field]: value
        }
    })
}
    
</script>
<template>   
        <is-table
            :items="items"
            :columns="columns"
            class="text-sm data-view-table"
        >

            <template #columns="{ classes }">
                <tr :class="classes.tr">

                    <th
                        class="cell-border border-b p-0 text-sm w-4"
                        :class="classes.th"
                    >
                        
                    </th>

                    <th
                        v-for="column in columns"
                        :key="column.id"
                        class="border-b border-r cell-border p-0 cursor-pointer"
                        :class="classes.th"
                        @click="$emit('column:update', column)"
                    >
                        <div class="text-gray-500"> {{ column.label }}</div>
                    </th>                       

                    <th
                        class="cell-border border-b text-action p-0 cursor-pointer text-sm"
                        :class="classes.th"
                        @click="$emit('column:new')"
                    >
                        <fa-icon icon="plus" />
                    </th>
                </tr>
            </template>

            <template #item="{ item, classes }">
                <tr :class="classes">
                    <td class="cell-border border-b  p-0 px-2" @click="$emit('item:show', item)">
                        <i
                            class="flex items-center justify-center cursor-pointer text-gray-500">
                            <fa-icon icon="bars" />
                        </i>
                    </td>

                    <td
                        v-for="(column, cIndex) in columns.filter(c => !c.hide)"
                        :key="cIndex"
                        class="cell-border border-b border-r p-0"
                    >
                        <div v-if="!column.field" />
                    
                        <input
                            v-else
                            v-model="item[column.field]"
                            class="p-2 bg-transparent hover:bg-gray-800 focus:bg-gray-800 focus:outline focus:outline-2 focus:outline-teal-500  w-full"
                            :disabled="column.readonly"
                            @change="(e) => updateItem(item.id, column.field, (e.target as any).value)"
                            @keyup.shift.enter="$emit('items:new')"
                        >

                    </td>

                    <td class="cell-border border-b p-0 p-2"></td>
                </tr>
            </template>


            <template #body-append>
                <tr>
                    <td
                        class="cell-border border-b p-0 text-action p-2 cursor-pointer hover:bg-gray-700 text-sm"
                        :colspan="columns.length + 2"
                        @click="$emit('item:new')"
                    >
                        <fa-icon icon="plus" class="mr-2" />

                        <span>New</span>

                    </td>
                </tr>
            </template>


        </is-table>
</template>

<style>
    .data-view-table .text-action {
        @apply text-gray-500;
    }
    
    .data-view-table .cell-border {
        @apply  border-gray-700;
    }

</style>