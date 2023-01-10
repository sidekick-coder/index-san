<script setup lang="ts">
import { computed } from 'vue'

import { createValue } from '@/modules/item/composables/value'

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

const { payload, loading, column, save } = createValue({
    collectionId: props.collectionId,
    columnId: props.columnId,
    itemId: props.itemId,
})

const options = computed(() => {
    if (!column.value) return []

    return column.value.options
})

const color = computed(() => {
    if (!column.value) return

    const selected = column.value.options.find((o) => o.name === payload.value)

    if (!selected) return

    return selected.color
})
</script>

<template>
    <v-input
        v-if="loading"
        :model-value="`${$t('loading')}...`"
        class="text-t-secondary text-sm"
        readonly
    />

    <v-select
        v-else
        v-model="payload"
        :options="options"
        label-key="name"
        value-key="name"
        :clear-value="() => null"
        @update:model-value="save"
    >
        <template #selection="{ attrs, displayValue }">
            <div class="px-4 min-h-[40px] flex items-center" v-bind="attrs">
                <v-card
                    class="px-2 py-1 text-xs rounded"
                    width="auto"
                    :color="color || 'accent'"
                    :class="!payload ? 'opacity-0' : ''"
                >
                    {{ displayValue }}
                </v-card>
            </div>
        </template>
        <template #option="{ option, attrs }">
            <v-list-item v-bind="attrs" color="opacity-75 hover:opacity-100">
                <v-card
                    class="px-2 py-1 text-xs rounded"
                    width="auto"
                    :color="option.color || 'accent'"
                >
                    {{ option.name }}
                </v-card>
            </v-list-item>
        </template>
    </v-select>
</template>
