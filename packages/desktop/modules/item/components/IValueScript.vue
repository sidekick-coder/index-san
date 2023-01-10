<script setup lang="ts">
import { ref } from 'vue'

import { createValue } from '@/modules/item/composables/value'
import EvaluationOutput from '@/../core/entities/evaluation-output'
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

const { column, item, onLoaded } = createValue({
    collectionId: props.collectionId,
    columnId: props.columnId,
    itemId: props.itemId,
})

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
        .then((r) => (output.value = r))
        .catch(() => (output.value = undefined))
}

await new Promise<void>((resolve) => onLoaded(resolve))

await setResult()
</script>

<template>
    <div>
        {{ output?.result }}
    </div>
</template>
