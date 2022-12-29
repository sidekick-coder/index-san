<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import moment from 'moment'

import { useVModel } from '@vueuse/core'
import Column from '@/../core/entities/column'
import { useStore } from '../store'

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

const related = computed(() => store.get(props.column.collectionId, model.value))

const display = computed(() => {
    console.log(related.value)

    return null
})

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
