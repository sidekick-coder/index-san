<script lang="ts">
export default { name: 'IsTable' }
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Column {
    name: string
    label?: string
    field?: string
    width: number
}

const props = defineProps({
    items: {
        type: Array as () => Record<string, string>[],
        default: () => [],
    },
    columns: {
        type: Array as () => Column[],
        default: () => [],
    },
    limit: {
        type: [Number, String],
        default: 10,
    },
    fixed: {
        type: Boolean,
        default: true,
    },
})

const pagination = ref({ limit: +props.limit })

const visibleItems = computed(() => props.items.slice(0, pagination.value.limit))

const classes = computed(() => ({
    main: 'is-table w-full border-gray-700',
    th: 'text-left p-2 border-r last:border-r-0 relative border-gray-700',
    td: 'text-left p-0 border-r last:border-r-0 border-gray-700',
    tr: 'item border-b border-gray-700',
}))
</script>

<template>
    <table :class="[classes.main, fixed ? 'table-fixed' : '']">
        <thead>
            <slot name="column" :classes="classes" :columns="columns">
                <tr :class="classes.tr" class="relative">
                    <th
                        v-for="column in columns"
                        :key="column.name"
                        :class="classes.th"
                        :style="column.width ? `width: ${column.width}px` : ''"
                    >
                        <div class="text-gray-500">{{ column.label }}</div>
                    </th>
                </tr>
            </slot>
        </thead>

        <slot v-for="item in visibleItems" :key="item" name="item" :item="item" :classes="classes">
            <tr :class="classes.tr">
                <td
                    v-for="column in columns"
                    :key="`${item.id}-${column.name}`"
                    :class="classes.td"
                    class="relative"
                >
                    <slot :name="`item-${column.name}`" :item="item" :column="column">
                        <div class="p-2 bg-transparent w-full">
                            {{ column.field ? item[column.field] : '' }}
                        </div>
                    </slot>
                </td>
            </tr>
        </slot>

        <tr v-if="!visibleItems.length">
            <td
                :class="classes.td"
                :colspan="columns.length + 2"
                class="p-2 cursor-pointer hover:bg-gray-800 text-gray-500 text-sm text-center"
            >
                No items
            </td>
        </tr>

        <tr v-if="items.length > pagination.limit" :class="classes.tr">
            <td
                :class="classes.td"
                :colspan="columns.length + 2"
                class="p-2 cursor-pointer hover:bg-gray-800 text-gray-500 text-sm border-r-0"
                @click="pagination.limit = pagination.limit + Number(limit)"
            >
                <fa-icon icon="arrow-down" class="mr-2" />

                <span>Load more {{ `(${visibleItems.length}/${items.length})` }}</span>
            </td>
        </tr>

        <slot name="append-body" :classes="classes" />
    </table>
</template>
