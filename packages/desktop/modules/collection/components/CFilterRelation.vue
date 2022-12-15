<script setup lang="ts">
import { CollectionColumn } from '@/../core/entities/collection'
import Item from '@/../core/entities/item'
import get from 'lodash/get'
import set from 'lodash/set'

import { computed, ref } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'
import { Filter, operations } from '../composables/filter'
import { useStore } from '../store'

const props = defineProps({
    modelValue: {
        type: Object as () => Filter,
        default: () => ({}),
    },
    column: {
        type: Object as () => CollectionColumn,
        default: () => ({}),
    },
})

const emit = defineEmits(['update:modelValue'])

// set value
const model = useVModel(props, 'modelValue', emit)

const operation = computed<keyof typeof operations.relation>({
    get() {
        return get(model.value, 'config.operation')
    },
    set(value) {
        set(model.value, 'config.operation', value)
    },
})

if (!operation.value) operation.value = '='

const options = Object.keys(operations.relation).map((key) => ({
    label: key,
    value: key,
}))

// Relation
const store = useStore()

const relation = ref({
    items: [] as Item[],
})

store.item
    .list({
        collectionId: props.column.collectionId,
    })
    .then((r) => (relation.value.items = r.data))
    .catch(() => (relation.value.items = []))
</script>
<template>
    <div class="flex w-full">
        <is-select
            v-model="operation"
            menu:offset-y
            :options="options"
            label-key="label"
            value-key="value"
            class="mr-4 max-w-[80px]"
        />

        <is-select
            v-model="model.value"
            :placeholder="$t('value')"
            :options="relation.items"
            :label-key="column.displayField || 'id'"
            class="w-full"
            value-key="id"
            menu:offset-y
        />
    </div>
</template>
