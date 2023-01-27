<script lang="ts" setup>
import uniq from 'lodash/uniq'

import type { PropType } from 'vue'
import { toCssMeasurement } from '@composables/utils'
import { useVModel } from 'vue-wind/composables/v-model'

interface Column {
    name: string
    label?: string
    field?: string
    width?: number
    [key: string]: any
}

// Props & Emits
const props = defineProps({
    modelValue: {
        type: Array as PropType<any[] | null>,
        default: null,
    },
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

const emit = defineEmits(['update:modelValue'])

// Pagination
const pagination = ref({ page: 1 })

// Parse columns
const parsedColumns = computed(() => {
    const result: Column[] = props.columns.map((column) => {
        const style: any = {}

        if (column.width) {
            style.width = toCssMeasurement(column.width)
        }

        return {
            ...column,
            style,
        }
    })

    if (selected.value) {
        result.unshift({
            id: 'select',
            name: 'select',
            label: '',
            style: {
                width: toCssMeasurement(40),
            },
        })
    }

    return result
})

// Parse items

const visibleItems = computed(() => props.items.slice(0, pagination.value.page * +props.limit))

function getKey(item: any, index: number) {
    if (!props.itemKey) return index

    return item[props.itemKey]
}

// Selected

const selected = useVModel(props, 'modelValue', emit)

function onSelect(item: any, itemIndex: number, e?: MouseEvent) {
    if (!selected.value) return

    if (e) e.preventDefault()

    const key = getKey(item, itemIndex)

    if (!e?.ctrlKey && !e?.shiftKey) {
        selected.value = [key]
        return
    }

    if (e.ctrlKey && selected.value.includes(key)) {
        selected.value = selected.value.filter((item) => item !== key)
        return
    }

    if (e.ctrlKey) {
        selected.value = uniq([...selected.value, key])
        return
    }

    if (!selected.value.length) {
        return
    }

    const start = selected.value[0]

    const firstIndex = props.items.findIndex((item, index) => getKey(item, index) === start)

    const lastIndex = props.items.findIndex((item, index) => getKey(item, index) === key)

    const startIndex = Math.min(firstIndex, lastIndex)
    const endIndex = Math.max(firstIndex, lastIndex)

    const all: any[] = []

    props.items.forEach((item, index) => {
        if (index >= startIndex && index <= endIndex) {
            all.push(getKey(item, index))
        }
    })

    selected.value = all
}

function selectAllVisible() {
    const all: any[] = []

    visibleItems.value.forEach((item, index) => {
        all.push(getKey(item, index))
    })

    selected.value = all
}
</script>
<template>
    <table
        class="w-full border-lines border-spacing-0 relative"
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
                        <v-th
                            v-if="column.name === 'select'"
                            :style="column.style"
                            class="text-t-secondary"
                            no-padding
                        >
                            <v-checkbox
                                class="justify-center"
                                :model-value="selected?.length === visibleItems.length"
                                @update:model-value="selectAllVisible"
                            />
                        </v-th>
                        <v-th v-else :style="column.style" class="text-t-secondary">
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
            :is-selected="() => selected?.includes(getKey(item, index))"
            :select-attrs="{
                onClick: (e: MouseEvent) => onSelect(item, index, e),
            }"
            :select="(e?: MouseEvent) => onSelect(item, index, e)"
            name="item"
        >
            <v-tr>
                <slot
                    v-for="column in parsedColumns"
                    :name="`item-${column.name}`"
                    :item="item"
                    :column="column"
                    :index="index"
                    :attrs="{ style: column.style }"
                >
                    <v-td
                        v-if="column.name === 'select'"
                        :key="`${item.id}-select`"
                        :style="column.style"
                    >
                        <v-checkbox
                            :model-value="selected?.includes(getKey(item, index))"
                            @click="(e: MouseEvent) => onSelect(item, index, e)"
                        />
                    </v-td>

                    <v-td v-else :key="`${item.id}-${column.name}`" :style="column.style">
                        {{ column.field ? item[column.field] : '' }}
                    </v-td>
                </slot>
            </v-tr>
        </slot>

        <v-tr v-if="!visibleItems.length">
            <v-td :colspan="parsedColumns.length" class="text-t-secondary text-sm text-center">
                {{ $t('noEntity', [$t('item', 2)]) }}
            </v-td>
        </v-tr>

        <slot
            name="pagination"
            :pagination="pagination"
            :limit="limit"
            :length="visibleItems.length"
            :columns="parsedColumns"
        >
            <v-tr v-if="visibleItems.length < items.length" class="border-b border-lines">
                <v-td
                    :colspan="parsedColumns.length"
                    class="cursor-pointer hover:bg-b-secondary text-t-secondary text-sm border-r-0 text-center"
                    @click="pagination.page++"
                >
                    <fa-icon icon="arrow-down" class="mr-2" />

                    <span>{{ `${$t('loadMore')} (${visibleItems.length}/${items.length})` }}</span>
                </v-td>
            </v-tr>
        </slot>

        <slot name="append" :columns="parsedColumns" />
    </table>
</template>
