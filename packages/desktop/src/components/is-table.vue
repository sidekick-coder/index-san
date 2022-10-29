
<script lang="ts">
export default {
    name: 'IsTable'
}
</script>
<script setup lang="ts">
import { computed } from 'vue'
import { useBuilder } from 'vue-wind/composables/builder'

interface Column {
    id: string
    label?: string
    field?: string
    type?: string,
    options?: string[]
}

defineProps({
    items: {
        type: Array as () => Record<string, string>[],
        default: () => []
    },
    columns: {
        type: Array as () => Column[],
        default: () => []
    },
})

const builder = useBuilder()

const borderColor = 'border-gray-700'
const actionsColor = 'text-gray-700'

builder.add('is-table w-full border').add(borderColor)

builder.createChild('th').add('text-left p-2 border-b border-r').add(borderColor)
builder.createChild('td').add('text-left p-0 border-b border-r').add(borderColor)
builder.createChild('actions').add('actions flex items-center h-full').add(actionsColor)

builder.createChild('tr').add('item')

const classes = computed(() => ({
    main: builder.make(),
    th: builder.child('th').make(),
    td: builder.child('td').make(),
    tr: builder.child('tr').make(),
    actions: builder.child('actions').make(),
}))
</script>

<template>
    <table :class="classes.main">
        <thead>
            <tr :class="classes.tr">
                <th
                    v-for="column in columns"
                    :key="column.id"
                    :class="classes.th"
                    @click="$emit('column:update', column)"
                >
                    <div class="text-gray-500"> {{ column.label }}</div>
                </th>                       

                <!-- <th
                    class="cell-border border-b text-action p-0 cursor-pointer text-sm"
                    :class="classes.th"
                    @click="$emit('column:new')"
                >
                    <fa-icon icon="plus" />
                </th> -->
            </tr>
        </thead>

        <tr
            v-for="item in items"
            :class="classes.tr"
            class="relative"
            :key="item.id"
        >


            <td
                v-for="(column, cIndex) in columns"
                :key="cIndex"
                :class="classes.td"
            >

            <i
                class="absolute cursor-pointer -ml-[25px]"
                :class="classes.actions"
                v-if="cIndex === 0"
                @click="$emit('item:show', item)"
            >
                <fa-icon icon="eye" />
            </i>

                <div v-if="!column.field" />
            
                <input
                    v-else
                    v-model="item[column.field]"
                    class="p-2 bg-transparent hover:bg-gray-800 focus:bg-gray-800 focus:outline focus:outline-2 focus:outline-teal-500  w-full"
                    @change="$emit('item:update', item)"
                >

            </td>

            <!-- <td class="cell-border border-b p-0 p-2"></td> -->
        </tr>

    </table>  
</template>

<style lang="scss">
.is-table {
    .item {
        .actions {
            opacity: 0;
        }

        &:hover {
            .actions {
                opacity: 1;
            }
        }
    }
}
</style>