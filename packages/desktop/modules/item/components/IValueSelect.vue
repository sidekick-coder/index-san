<script setup lang="ts">
import { watch, computed } from 'vue'

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

const { payload, load, column, loading } = createValue()

watch(props, load, {
    deep: true,
    immediate: true,
})

const options = computed(() => {
    if (!column.value) return []

    return column.value.options.split(',').map((o: string) => o.trim())
})
</script>

<template>
    <v-input
        v-if="loading.all"
        :model-value="`${$t('loading')}...`"
        class="text-t-secondary text-sm"
        readonly
    />

    <v-select v-else v-model="payload" :options="options" />
</template>
