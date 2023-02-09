<script setup lang="ts">
import { computed } from 'vue'
import { createValue } from '../composables/value'
import moment from 'moment'
import { ColumnType } from '@core/entities/column'

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

const { column, item, onLoaded } = createValue(props)

await new Promise<void>((resolve) => onLoaded(resolve))
// display
const display = computed(() => {
    if (!item.value || !column.value) return ''

    if (column.value.type === ColumnType.createdAt) {
        return moment(new Date(item.value._createdAt)).format('L LT')
    }

    return moment(new Date(item.value._updatedAt)).format('L LT')
})
</script>

<template>
    <v-input v-if="edit" :model-value="display" readonly />

    <div v-else>{{ display }}</div>
</template>
