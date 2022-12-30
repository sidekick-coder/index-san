<script setup lang="ts">
import { watch, ref } from 'vue'

import Item from '@core/entities/item'

import { createValue } from '@/modules/item/composables/value'
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

// value

const { payload, load, column, loading } = createValue()

watch(props, load, {
    deep: true,
    immediate: true,
})

// options
const store = useStore()

const options = ref<Item[]>([])

async function setOptions() {
    if (!column.value) return

    options.value = await store.item.list(column.value.collectionId)
}

watch(column, setOptions)
</script>

<template>
    <v-input
        v-if="loading.all"
        :model-value="`${$t('loading')}...`"
        class="text-t-secondary text-sm"
        readonly
    />

    <v-input
        v-else-if="!column"
        :model-value="$t('errors.unknown')"
        class="text-t-secondary text-sm"
        readonly
    />

    <v-select
        v-else
        v-model="payload"
        :options="options"
        value-key="id"
        :label-key="column.displayField"
        :clear-value="() => null"
    />
</template>
