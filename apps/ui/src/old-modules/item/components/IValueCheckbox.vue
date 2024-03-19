<script setup lang="ts">
import { createValue } from '@modules/item/composables/value'

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

const { payload, save, onLoaded } = createValue({
    collectionId: props.collectionId,
    columnId: props.columnId,
    itemId: props.itemId,
})

await new Promise<void>((resolve) => onLoaded(resolve))
</script>

<template>
    <v-checkbox
        v-model="payload"
        autofocus
        @update:model-value="save"
    />
</template>
