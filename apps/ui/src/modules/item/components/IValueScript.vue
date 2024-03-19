<script setup lang="ts">
import { ref, watch } from 'vue'

import EvaluationOutput from '@index-san/core/entities/evaluation-output'

import { createValue } from '@modules/item/composables/value'
import { useStore } from '@store/global'

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

const { column, item, onLoaded } = createValue({
    collectionId: props.collectionId,
    columnId: props.columnId,
    itemId: props.itemId,
})

await new Promise<void>((resolve) => onLoaded(resolve))

// execute script

const store = useStore()

const output = ref<EvaluationOutput>()

async function setResult() {
    if (!column.value || !item.value) return

    await store.script
        .execute({
            content: column.value.content,
            scope: { item: item.value },
        })
        .then((r) => (output.value = new EvaluationOutput(r)))
        .catch(() => (output.value = undefined))
}

await setResult()

watch([column, item], setResult, {
    deep: true,
})
</script>

<template>
    <v-input v-if="edit" :model-value="output?.result" readonly />
    <div v-else>
        {{ output?.result }}
    </div>
</template>
