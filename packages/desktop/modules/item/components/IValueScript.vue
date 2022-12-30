<script setup lang="ts">
import { watch, ref } from 'vue'

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

const { load, column, item, loading } = createValue()

watch(props, load, {
    deep: true,
    immediate: true,
})

// execute script

const store = useStore()

const output = ref<EvaluationOutput>()

function setResult() {
    if (!column.value || !item.value) return

    store.script
        .execute({
            content: column.value.content,
            scope: { item: item.value },
        })
        .then((r) => (output.value = r))
        .catch(() => (output.value = undefined))
}

watch([column, item], setResult)
</script>

<template>
    <v-input
        v-if="loading.all"
        :model-value="`${$t('loading')}...`"
        class="text-t-secondary text-sm"
        readonly
    />

    <v-input v-else :model-value="output?.result" readonly />
</template>
