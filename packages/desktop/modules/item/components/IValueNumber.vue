<script setup lang="ts">
import { createValue } from '@/modules/item/composables/value'
import { ref } from 'vue'

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

const edit = ref(false)
</script>

<template>
    <div v-if="!edit" class="cursor-pointer" @click="edit = true">
        {{ payload }}
    </div>

    <v-input
        v-else
        v-model="payload"
        type="number"
        autofocus
        @update:model-value="save"
        @blur="edit = false"
    />
</template>
