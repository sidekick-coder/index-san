
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
    name: string
    label?: string
    field?: string
    width: | number
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
        type: [Number, String],
        default: 10
    },
})

const builder = useBuilder()
const aggregation = computed(() => useAggregation(props.items))

const pagination = ref({ limit: +props.limit })
const innerColumns = ref(props.columns.slice().map(c => ({
    ...c,
    width: c.width ?? 300
})))

const visibleItems = computed(() => props.items.slice(0, pagination.value.limit))

const borderColor = 'border-gray-700'
const actionsColor = 'text-gray-500'

builder
    .add('is-table table-fixed w-full')
    .add(borderColor)

builder
    .createChild('th')
    .add('text-left p-2 border-r relative')
    .add(borderColor)

builder
    .createChild('td')
    .add('text-left p-0 border-r')
    .add(borderColor)

builder
    .createChild('actions')
    .add('actions flex items-center h-full')
    .add(actionsColor)

builder.createChild('tr').add('item border-b').add(borderColor)

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
            <slot name="column" :classes="classes" :columns="innerColumns" >
                <tr :class="classes.tr" class="relative">
                    <th
                        v-for="column in innerColumns"
                        :key="column.name"
                        :class="classes.th"
                        :style="column.width ? `width: ${column.width}px` : '' "
                    >
                        
                        <div class="text-gray-500"> {{ column.label }}</div>
    
                        <is-resize-line v-model="column.width" :min-width="100" />
                    </th>                   
                </tr>
            </slot>
        </thead>

        <slot
            v-for="item in visibleItems"
            name="item"
            :key="item.id"
            :item="item"
            :classes="classes"
        >
            <tr :class="classes.tr" >    
                <td
                    v-for="column in columns"
                    :key="`${item.id}-${column.name}`"
                    :class="classes.td"
                    class="relative"
                >
    
                    <slot :name="`item-${column.name}`" :item="item" :column="column">
                        <div class="p-2 bg-transparent  w-full" >
                            {{ column.field ? item[column.field] : '' }}
                        </div>
                    </slot>     
    
                </td>
    
            </tr>
        </slot>

        
        <tr v-if="!visibleItems.length">
            <td
                :class="[classes.td, actionsColor]"
                :colspan="columns.length + 2"
                class="p-2 cursor-pointer hover:bg-gray-800 text-sm text-center"
            >
                No items
            </td>
        </tr>

        <tr v-if="items.length > pagination.limit">
            <td
                :class="[classes.td, actionsColor]"
                :colspan="columns.length + 2"
                class="p-2 cursor-pointer hover:bg-gray-800 text-sm border-r-0"
                @click="pagination.limit = pagination.limit + Number(limit)"
            >
                <fa-icon icon="arrow-down" class="mr-2" />

                <span>Load more {{`(${visibleItems.length}/${items.length})`}}</span>

            </td>
        </tr>

        <slot name="append-body" :classes="classes" />

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