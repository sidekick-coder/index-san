<script setup lang="ts">
import { computed, watch } from 'vue'
import { createValue } from '../composables/value'
import moment from 'moment'
import { ColumnType } from '@/../core/entities/column'

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

const { column, item, loading } = createValue(props)

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
    <v-input
        v-if="loading"
        :model-value="`${$t('loading')}...`"
        class="text-t-secondary text-sm"
        readonly
    />

    <v-input v-else :model-value="display" readonly> </v-input>
</template>
