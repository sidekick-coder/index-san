<script setup lang="ts">
import { watch } from 'vue'

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

const { payload, load, loading } = createValue()

watch(props, load, {
    deep: true,
    immediate: true,
})
</script>

<template>
    <v-input
        v-if="loading.all"
        :model-value="`${$t('loading')}...`"
        class="text-t-secondary text-sm"
        readonly
    />

    <v-input v-else v-model="payload" type="number" />
</template>
