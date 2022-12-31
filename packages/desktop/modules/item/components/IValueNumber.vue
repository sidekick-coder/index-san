<script setup lang="ts">
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

const { payload, loading, save } = createValue(props)
</script>

<template>
    <v-input
        v-if="loading"
        :model-value="`${$t('loading')}...`"
        class="text-t-secondary text-sm"
        readonly
    />

    <v-input v-else v-model="payload" type="number" @update:model-value="save" />
</template>
