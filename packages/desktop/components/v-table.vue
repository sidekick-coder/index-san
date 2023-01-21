<script lang="ts" setup>
import { computed, ref } from 'vue'
import { toCssMeasurement } from '@composables/utils'

interface ColumnPadding {
    top?: number
    left?: number
    right?: number
    bottom?: number
}

interface Column {
    name: string
    label?: string
    field?: string
    width?: number
    padding?: ColumnPadding
}

// Props & Emits
const props = defineProps({
    items: {
        type: Array as () => any[],
        default: () => [],
    },
    columns: {
        type: Array as () => Column[],
        default: () => [],
    },
    limit: {
        type: [Number, String],
        default: 20,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    fixed: {
        type: Boolean,
        default: true,
    },
    headerStick: {
        type: Boolean,
        default: false,
    },
    itemKey: {
        type: String,
        default: null,
    },
})

// Pagination
const pagination = ref({ page: 1 })

// Parse columns
const parsedColumns = computed(() =>
    props.columns.map((column) => {
        const style: any = {}

        if (column.width) {
            style.width = toCssMeasurement(column.width)
        }

        if (column.padding?.left) {
            style['padding-left'] = toCssMeasurement(column.padding.left)
        }

        if (column.padding?.right) {
            style['padding-right'] = toCssMeasurement(column.padding.right)
        }

        return {
            ...column,
            style,
        }
    })
)

// Parse items

const visibleItems = computed(() => props.items.slice(0, pagination.value.page * +props.limit))

function getKey(item: any, index: number) {
    if (!props.itemKey) return index

    return item[props.itemKey]
}
</script>
<template>
    <table
        class="w-full border-lines border-separate border-spacing-0 relative"
        :class="[fixed ? 'table-fixed' : '', loading ? 'animate-pulse' : '']"
    >
        <thead>
            <slot name="column" :columns="parsedColumns">
                <v-tr :class="[headerStick ? 'sticky top-0' : '']" class="bg-b-primary">
                    <slot
                        v-for="column in parsedColumns"
                        :key="column.name"
                        :name="`column-${column.name}`"
                        :attrs="{ style: column.style }"
                    >
                        <v-th :style="column.style" class="text-t-secondary">
                            {{ column.label }}
                        </v-th>
                    </slot>
                </v-tr>
            </slot>
        </thead>

        <slot
            v-for="(item, index) in visibleItems"
            :key="getKey(item, index)"
            :items="visibleItems"
            :columns="parsedColumns"
            :item="item"
            :index="index"
            name="item"
        >
            <v-tr>
                <slot
                    v-for="column in parsedColumns"
                    :name="`item-${column.name}`"
                    :item="item"
                    :column="column"
                    :attrs="{ style: column.style }"
                >
                    <v-td :key="`${item.id}-${column.name}`" :style="column.style">
                        {{ column.field ? item[column.field] : '' }}
                    </v-td>
                </slot>
            </v-tr>
        </slot>

        <v-tr v-if="!visibleItems.length">
            <v-td :colspan="columns.length" class="text-t-secondary text-sm text-center">
                {{ $t('noEntity', [$t('item', 2)]) }}
            </v-td>
        </v-tr>

        <slot
            name="pagination"
            :pagination="pagination"
            :limit="limit"
            :length="visibleItems.length"
        >
            <v-tr v-if="visibleItems.length < items.length">
                <v-td
                    :colspan="columns.length"
                    class="cursor-pointer hover:bg-b-secondary text-t-secondary text-sm border-r-0 text-center"
                    @click="pagination.page++"
                >
                    <fa-icon icon="arrow-down" class="mr-2" />

                    <span>{{ `${$t('loadMore')} (${visibleItems.length}/${items.length})` }}</span>
                </v-td>
            </v-tr>
        </slot>

        <slot name="append" />
    </table>
</template>
