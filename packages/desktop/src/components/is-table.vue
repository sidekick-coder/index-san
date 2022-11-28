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
    main: 'is-table w-full border-lines',
    th: 'text-left p-2 border-r last:border-r-0 relative border-lines',
    td: 'text-left p-0 border-r last:border-r-0 border-lines',
    tr: 'item border-b border-lines',
}))

function getStyle(column) {
    const result: Record<string, string> = {}

    if (column.width) {
        result.width = `${column.width}px`
    }

    if (column.padding?.left) {
        result['padding-left'] = `${column.padding?.left}px`
    }

    if (column.padding?.right) {
        result['padding-right'] = `${column.padding?.right}px`
    }

    return result
}
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
                        :style="getStyle(column)"
                    >
                        <div class="text-t-secondary">{{ column.label }}</div>
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
                    <slot
                        :name="`item-${column.name}`"
                        :item="item"
                        :column="column"
                        :attrs="{ style: getStyle(column) }"
                    >
                        <div class="p-2 bg-transparent w-full" :style="getStyle(column)">
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
                class="p-2 cursor-pointer hover:bg-b-secondary text-t-secondary text-sm text-center"
            >
                No items
            </td>
        </tr>

        <tr v-if="items.length > pagination.limit" :class="classes.tr">
            <td
                :class="classes.td"
                :colspan="columns.length + 2"
                class="p-2 cursor-pointer hover:bg-b-secondary text-t-secondary text-sm border-r-0"
                @click="pagination.limit = pagination.limit + Number(limit)"
            >
                <fa-icon icon="arrow-down" class="mr-2" />

                <span>Load more {{ `(${visibleItems.length}/${items.length})` }}</span>
            </td>
        </tr>

        <slot name="append-body" :classes="classes" />
    </table>
</template>
