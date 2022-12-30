<script setup lang="ts">
import { computed, watch } from 'vue'
import { createValue } from '../composables/value'
import moment from 'moment'

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

const { payload, load, column, loading } = createValue()

watch(props, load, {
    deep: true,
    immediate: true,
})

// display
const display = computed(() => {
    if (!payload.value || !column.value) return ''

    return moment(payload.value).format('L LT')
})
</script>

<template>
    <v-input
        v-if="loading.all"
        :model-value="`${$t('loading')}...`"
        class="text-t-secondary text-sm"
        readonly
    />

    <v-input v-else :model-value="display" readonly> </v-input>
</template>
