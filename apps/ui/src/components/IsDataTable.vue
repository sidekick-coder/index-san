<script lang="ts" setup generic="T extends DataItem, F extends DataField<any>">
import type { DataField, DataItem, DataPagination } from '@/composables/defineDataTable'

import get from 'lodash/get'
import { twMerge } from 'tailwind-merge';

const fields = defineProp<F[]>('fields', {
    type: Array,
    default: () => [],
})

const fieldClass = defineProp<string>('fieldClass', {
    type: String,
    default: null,
})

const itemFieldClass = defineProp<string>('itemFieldClass', {
    type: String,
    default: null,
})

const items = defineModel<T[]>('items', {
    type: Array,
    default: () => [],
})

const itemKey = defineProp<string>('itemKey', {
    type: String,
    default: null,
})

const pagination = defineModel<DataPagination>('pagination', {
    type: Object,
    default: null,
})

const loading = defineProp<boolean>('loading', {
    type: Boolean,
    default: false,
})

function findItemKey(item: T) {
    if (!itemKey) {
        return items.value.indexOf(item)
    }

    return get(item, itemKey.value)
}

function findItemValue(item: any, field: F) {
    if (typeof field.value === 'function') {
        return field.value(item)
    }

    if (field.value) {
        return get(item, field?.value, '')
    }

    if (field.name) {
        return get(item, field.name, '')
    }

    return ''
}

const itemClass = defineProp('itemClass', {
    type: [String, Function],
    default: ''
})

function findItemClass(item: any) {
    if (typeof itemClass.value === 'function') {
        return itemClass.value(item)
    }

    return itemClass.value
}

const className = defineProp<string>('class', {
    type: [String, Array, Object]
})
</script>

<template>
    <div :class="twMerge('flex w-full flex-col', className)">
        <div
            v-if="fields.length"
            class="hidden  md:flex min-h-10"
        >
            <div
                v-for="(f, index) in fields"
                :key="index"
                :style="f.style"
                :class="twMerge(
                    'flex-1 px-5 py-2 font-bold',
                    'border-y border-body-500',
                    fieldClass,
                    f.class
                )"
            >
                <slot
                    name="field"
                    :field="f"
                >
                    {{ f.label }}
                </slot>
            </div>
        </div>

        <div
            v-if="loading"
            class="flex w-full items-center justify-center h-10 border-b border-body-500 text-sm"
        >
            Loading...
        </div>

        <div
            v-else
            class="flex w-full flex-col justify-start"
        >
            <div
                v-if="!items.length"
                class="flex flex-col items-center md:flex-row border-b border-body-500"
            >
                <div class="w-full px-5 py-2 text-center text-body-50">
                    No items
                </div>
            </div>

            <div
                v-for="item in items"
                :key="findItemKey(item)"
                :class="twMerge('flex flex-col md:flex-row border-b border-body-500 min-h-10', findItemClass(item))"
            >
                <div
                    v-for="(field, fieldIndex) in fields"
                    :key="`${findItemKey(item)}-${field.name}`"
                    :class="twMerge(
                        'flex-1 flex px-5 py-2',
                        field.class,
                        itemFieldClass,
                    )"
                    :style="field.style"
                >
                    <div class="break-all w-full">
                        <slot
                            :name="`item-${field.name}`"
                            :item="item"
                            :field="field"
                            :field-index="fieldIndex"
                            :value="findItemValue(item, field)"
                        >
                            {{ findItemValue(item, field) }}
                        </slot>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="pagination && pagination.total > 1"
            class="flex items-center"
        >
            <is-pagination
                v-model="pagination.page"
                :total="pagination.total"
            />
        </div>
    </div>
</template>
