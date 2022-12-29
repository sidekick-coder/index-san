<script setup lang="ts">
import { computed, watch } from 'vue'

import { useVModel } from '@vueuse/core'
import { useStore } from '../store'

import Column from '@core/entities/column'

const props = defineProps({
    modelValue: {
        type: String,
        default: null,
    },
    column: {
        type: Object as () => Column,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue'])

// model
const model = useVModel(props, 'modelValue', emit)

// related item

const store = useStore()

const relatedItems = computed(() => store.all(props.column.collectionId))

watch(
    () => props.column.collectionId,
    (id) => store.setItems(id),
    { immediate: true }
)
</script>

<template>
    <v-select
        v-model="model"
        :options="relatedItems"
        :label-key="column.displayField"
        value-key="id"
    />
</template>
