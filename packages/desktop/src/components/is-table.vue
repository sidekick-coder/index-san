
<script lang="ts">
export default {
    name: 'IsTable'
}
</script>
<script setup lang="ts">
import { useAggregation } from '@/composables/aggregations'
import { computed, ref } from 'vue'
import { useBuilder } from 'vue-wind/composables/builder'

interface Column {
    id: string
    label?: string
    field?: string
    type?: string,
    options?: string[]
}

const props = defineProps({
    items: {
        type: Array as () => Record<string, string>[],
        default: () => []
    },
    columns: {
        type: Array as () => Column[],
        default: () => []
    },
    aggregations: {
        type: Array as () => string[],
        default: () => []
    },
    limit: {
        type: Number,
        default: 10
    }
})

const builder = useBuilder()
const aggregation = computed(() => useAggregation(props.items))

const pagination = ref({
    limit: props.limit,
})

const visibleItems = computed(() => {    
    return props.items.slice(0, pagination.value.limit)
})

const borderColor = 'border-gray-700'
const actionsColor = 'text-gray-500'

builder
    .add('is-table w-full')
    .add(borderColor)

builder
    .createChild('th')
    .add('text-left p-2 border-b border-r last:border-r-0')
    .add(borderColor)

builder
    .createChild('td')
    .add('text-left p-0 border-b border-r last:border-r-0')
    .add(borderColor)

builder
    .createChild('actions')
    .add('actions flex items-center h-full')
    .add(actionsColor)

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
            <tr :class="classes.tr" class="relative">
                <th
                    v-for="(column, index) in columns"
                    :key="column.id"
                    :class="classes.th"
                    @click="$emit('column:update', column)"
                >
                    <slot name="column" :column="column" :index="index" >
                        <div class="text-gray-500"> {{ column.label }}</div>
                    </slot>

                    <i
                        class="absolute cursor-pointer -mr-[25px] right-0 top-0"
                        :class="classes.actions"
                        v-if="index === columns.length - 1"
                        @click="$emit('column:new')"
                    >
                        <fa-icon icon="plus" />
                    </i>
                </th>
            </tr>
        </thead>

        <tr
            v-for="item in visibleItems"
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

                <slot v-else name="item" :item="item" :column="column">
                    <input                        
                        v-model="item[column.field]"
                        class="p-2 bg-transparent hover:bg-gray-800 focus:bg-gray-800 focus:outline focus:outline-2 focus:outline-teal-500  w-full"
                        @change="$emit('item:update', item)"
                    >
                </slot>

                    <i
                        class="absolute cursor-pointer -mr-[25px] right-0 top-0"
                        :class="classes.actions"
                        v-if="cIndex === columns.length - 1"
                        @click="$emit('item:delete', item)"
                    >
                        <fa-icon icon="trash" />
                    </i>
            

            </td>

        </tr>

        
        <tr v-if="items.length > 10">
            <td
                :class="[classes.td, actionsColor]"
                :colspan="columns.length + 2"
                class="p-2 cursor-pointer hover:bg-gray-800 text-sm"
                @click="pagination.limit = pagination.limit + limit"
            >
                <fa-icon icon="arrow-down" class="mr-2" />

                <span>Load more {{`(${visibleItems.length}/${items.length})`}}</span>

            </td>
        </tr>

        <tr>
            <td
                :class="[classes.td, actionsColor]"
                :colspan="columns.length + 2"
                class="p-2 cursor-pointer hover:bg-gray-800 text-sm"
                @click="$emit('item:new')"
            >
                <fa-icon icon="plus" class="mr-2" />

                <span>New</span>

            </td>
        </tr>

        <tr v-if="aggregations.length">
            <td
                v-for="(c, index) in columns"
                :key="index"
                class="p-2 text-gray-500 hover:bg-gray-800 text-sm"
            >
                <div v-if="aggregations[index] === 'count'">
                    Count: {{ aggregation.count() }}
                </div>
                
                <div v-if="c.field && aggregations[index] === 'sum'">
                    Sum: {{ aggregation.sum(c.field) }}
                </div>
            </td>
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