<script lang="ts" setup>
import { computed, ref } from 'vue'
import { toCssMeasurement } from '@/composables/utils'

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
        type: Array as () => Record<string, string>[],
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
})

// Pagination
const pagination = ref({ limit: +props.limit })

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

const visibleItems = computed(() => props.items.slice(0, pagination.value.limit))
</script>
<template>
    <table
        class="w-full border-lines border-separate border-spacing-0 relative"
        :class="[fixed ? 'table-fixed' : '', loading ? 'animate-pulse' : '']"
    >
        <div v-if="loading" class="absolute top-0 left-0 h-[1px] w-full bg-accent animate-pulse" />

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
            name="item"
            :items="visibleItems"
            :columns="parsedColumns"
            :item="item"
            :index="index"
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

        <v-tr v-if="items.length > pagination.limit">
            <v-td
                :colspan="columns.length"
                class="cursor-pointer hover:bg-b-secondary text-t-secondary text-sm border-r-0"
                @click="pagination.limit = pagination.limit + Number(limit)"
            >
                <fa-icon icon="arrow-down" class="mr-2" />

                <span>{{ `${$t('loadMore')} (${visibleItems.length}/${items.length})` }}</span>
            </v-td>
        </v-tr>

        <slot name="append" />
    </table>
</template>
