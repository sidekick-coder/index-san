<script setup lang="ts">
import { watch } from 'vue'

import { createValue } from '@modules/item/composables/value'
import { useItemStore } from '../store'
import { useModelOrInnerValue } from '@composables/model'

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
    edit: {
        type: Boolean,
        default: null,
    },
})

const emit = defineEmits(['update:edit'])

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

// edit model

const editModel = useModelOrInnerValue(props, 'edit', emit)
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
            <v-input
                v-if="editModel"
                readonly
                v-bind="attrs"
                :model-value="displayValue || payload"
                class="w-full"
            >
            </v-input>

            <div v-else class="w-full min-h-[40px] flex items-center cursor-pointer" v-bind="attrs">
                {{ displayValue || payload }}
            </div>
        </template>
    </v-select>
</template>
