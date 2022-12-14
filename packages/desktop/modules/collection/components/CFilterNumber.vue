<script setup lang="ts">
import get from 'lodash/get'
import set from 'lodash/set'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVModel } from 'vue-wind/composables/v-model'
import { Filter, FilterNumberConfig } from '../composables/filter'

const props = defineProps({
    modelValue: {
        type: Object as () => Filter,
        default: () => ({}),
    },
})

const emit = defineEmits(['update:modelValue'])

// set value
const model = useVModel(props, 'modelValue', emit)

const operation = computed<FilterNumberConfig['operation']>({
    get() {
        return get(model.value, 'config.operation')
    },
    set(value) {
        set(model.value, 'config.operation', value)
    },
})

if (!operation.value) operation.value = '='

// options
const tm = useI18n()

interface Option {
    label: string
    value: FilterNumberConfig['operation']
}

const options: Option[] = [
    {
        label: '=',
        value: '=',
    },
    {
        label: '!=',
        value: '!=',
    },
    {
        label: '>',
        value: '>',
    },
]
</script>
<template>
    <is-select
        v-model="operation"
        menu:offset-y
        :label="$t('type')"
        :options="options"
        label-key="label"
        value-key="value"
        card:color="b-primary"
        class="mb-4 w-full"
    />

    <is-input v-model="model.value" type="number" :label="$t('value')" class="w-full" />
</template>
