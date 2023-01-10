<script setup lang="ts">
import { watch, ref } from 'vue'

import Item from '@core/entities/item'

import { createValue } from '@/modules/item/composables/value'
import { useStore } from '@/store/global'

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

// options
const store = useStore()

const options = ref<Item[]>([])

async function setOptions() {
    if (!column.value) return

    options.value = await store.item.list(column.value.collectionId)
}

watch(column, setOptions)

await new Promise<void>((resolve) => onLoaded(resolve))
</script>

<template>
    <v-select
        v-model="payload"
        :options="options"
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
