<script setup lang="ts">
import { watch } from 'vue'

import { createValue } from '@/modules/item/composables/value'
import { useItemStore } from '../store'

const props = defineProps({
    collectionId: {
        type: String,
        required: true,
    },
    columnId: {
        type: String,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },
})

// value

const { payload, column, onLoaded, save } = createValue(props)

await new Promise<void>((resolve) => onLoaded(resolve))

// options
let store = useItemStore(column.value!.collectionId)

watch(
    column,
    async () => {
        if (!column.value) return

        store = useItemStore(column.value.collectionId)

        await store.load()
    },
    { immediate: true }
)
</script>

<template>
    <v-select
        v-model="payload"
        :options="store.items"
        :clear-value="() => null"
        :label-key="column?.displayField"
        value-key="id"
        @update:model-value="save"
    >
        <template #selection="{ attrs, displayValue }">
            <div class="min-h-[40px] flex items-center cursor-pointer" v-bind="attrs">
                {{ displayValue || payload }}
            </div>
        </template>
    </v-select>
</template>
