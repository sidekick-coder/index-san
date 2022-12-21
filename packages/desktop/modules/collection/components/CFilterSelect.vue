<script setup lang="ts">
import { CollectionColumn } from '@core/entities/collection'
import get from 'lodash/get'
import set from 'lodash/set'

import { computed, ref } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'
import { Filter, operations } from '../composables/filter'

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

const operation = computed<keyof typeof operations.text>({
    get() {
        return get(model.value, 'config.operation')
    },
    set(value) {
        set(model.value, 'config.operation', value)
    },
})

if (!operation.value) operation.value = '='

const options = Object.keys(operations.text).map((key) => ({
    label: key,
    value: key,
}))
// Options
const select = ref({
    options: [] as string[],
})

if (props.column.options) {
    select.value.options = props.column.options.split(',').map((i: string) => i.trim())
}
</script>
<template>
    <div class="flex w-full">
        <v-select
            v-model="operation"
            :options="options"
            label-key="label"
            value-key="value"
            menu:offset-y
            class="mr-4 max-w-[80px]"
        />

        <v-select
            v-model="model.value"
            :placeholder="$t('value')"
            :options="select.options"
            class="w-full"
            menu:offset-y
        />
    </div>
</template>
