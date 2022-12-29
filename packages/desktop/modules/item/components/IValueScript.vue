<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from 'vue'

import { useStore } from '@/store/global'

import Column from '@core/entities/column'
import Item from '@core/entities/item'
import EvaluationOutput from '@core/entities/evaluation-output'

const SOutput = defineAsyncComponent(() => import('@/modules/script/components/SOutput.vue'))

const props = defineProps({
    column: {
        type: Object as () => Column,
        required: true,
    },
    item: {
        type: Object as () => Item,
        required: true,
    },
})

// set result

const store = useStore()

const result = ref<EvaluationOutput>()
const loading = ref(false)

function setResult() {
    loading.value = true

    store.script
        .execute({
            content: props.column.content,
            scope: { item: props.item },
        })
        .then((r) => (result.value = r))
        .catch(() => (result.value = undefined))
        .finally(() => setTimeout(() => (loading.value = false), 800))
}

watch(() => props.item, setResult, { immediate: true, deep: true })
</script>

<template>
    <v-dialog>
        <template #activator="{ attrs }">
            <v-input
                v-bind="{ ...attrs, ...$attrs }"
                :model-value="result?.result"
                readonly
                :loading="loading"
                input:class="cursor-pointer w-full"
            />
        </template>

        <v-card width="500" height="500" color="b-secondary">
            <v-card-head class="px-7">
                <v-card-title>
                    {{ $t('output') }}
                </v-card-title>
            </v-card-head>

            <s-output :output="result" />
        </v-card>
    </v-dialog>
</template>
