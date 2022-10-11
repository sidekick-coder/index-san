<script setup lang="ts">
import { computed } from 'vue'
import { useBuilder } from 'vue-wind/composables/builder'

interface Column {
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

builder.add('w-full')

builder.createChild('th').add('text-left p-2')

builder.createChild('tr')

const classes = computed(() => ({
    main: builder.make(),
    th: builder.child('th').make(),
    tr: builder.child('tr').make(),
}))
</script>

<template>
    <table :class="classes.main">
        <thead>
            <slot name="columns" :classes="classes">
                <tr :class="classes.tr">
                    <slot
                        v-for="(column, index) in columns"
                        :column="column"
                        :classes="classes.th"
                        name="column"
                    >
                        <th
                            
                            :key="index"
                            :class="classes.th"
                        >
                            {{ column.label ?? column.field }}
                        </th>
                    </slot>
                </tr>
            </slot>
        </thead>

        <slot
            v-for="(item, index) in items" :key="index"
            name="item"
            :item="item"
            :index="index"        

        >
            <tr :class="classes.tr">
                <td
                    v-for="(column, cIndex) in columns"
                    :key="cIndex"
                    class="border"
                >
                    {{ column.field ? item[column.field] : '' }}
                </td>
            </tr>

        </slot>
        

        <slot name="body-append"  />

    </table>  
</template>