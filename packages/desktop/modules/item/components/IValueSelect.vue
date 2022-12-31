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

    return column.value.options.split(',').map((o: string) => o.trim())
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
        :clear-value="() => null"
        @update:model-value="save"
    />
</template>
