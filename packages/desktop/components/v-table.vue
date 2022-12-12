<script lang="ts" setup>
import { computed, ref } from 'vue'

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
        default: 80,
    },
    fixed: {
        type: Boolean,
        default: true,
    },
})

// Pagination
const pagination = ref({ limit: +props.limit })

// Parse columns
const parsedColumns = computed(() =>
    props.columns.map((column) => {
        const style: any = {}

        if (column.width) {
            style.width = `${column.width}px`
        }

        if (column.padding?.left) {
            style['padding-left'] = `${column.padding?.left}px`
        }

        if (column.padding?.right) {
            style['padding-right'] = `${column.padding?.right}px`
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
    <table class="w-full border-lines" :class="[fixed ? 'table-fixed' : '']">
        <thead>
            <slot name="column" :columns="parsedColumns">
                <v-tr>
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
            v-for="item in visibleItems"
            :key="item"
            name="item"
            :items="visibleItems"
            :columns="parsedColumns"
            :item="item"
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
            <v-td :colspan="columns.length + 2" class="text-t-secondary text-sm text-center">
                No items
            </v-td>
        </v-tr>

        <v-tr v-if="items.length > pagination.limit">
            <v-td
                :colspan="columns.length + 2"
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
