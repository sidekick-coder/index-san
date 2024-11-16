<script lang="ts" setup generic="T extends TabItem">
import { twMerge } from 'tailwind-merge';
import type { TabItem } from './defineTabItems';

import orderBy from 'lodash/orderBy'

const items = defineProp<T[]>('items', {
    type: Array,
    required: true,
})

const model = defineModel<number | string>({
    type: [Number, String],
    default: null 
})

const headerContainerClass = defineProp<string>('headerContainerClass',{
    type: String,
    default: ''
})

const itemsOrdered = computed(() => {
    return orderBy(items.value, (i) => i.order || 99)
})

onMounted(() => {
    if (model.value === null && items.value.length > 0) {
        model.value = itemsOrdered.value[0].value
    }
})
</script>

<template>
    <div>
        <div
            :class="twMerge('flex  w-full items-center overflow-x-auto border-b border-body-500 px-4', headerContainerClass)"
        >
            <button
                v-for="item in itemsOrdered"
                :key="item.value"
                class="px-5 py-2 hover:bg-body-700 hover:text-body-50 border-b-2 border-transparent"
                :class="model === item.value ? 'text-primary-300 border-b-primary-300' : 'text-body-100'"
                @click="model = item.value"
            >
                {{ item.label }}
            </button>
        </div>

        <template
            v-for="item in items"
            :key="item.value"
        >
            <slot
                v-if="model === item.value"
                name="item"
                :item="item"
            />
        </template>
    </div>
</template>
