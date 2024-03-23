<script setup lang="ts">
import get from 'lodash/get'
import set from 'lodash/set'

import Column from '@index-san/core/entities/column'
import { ViewFilter } from '@index-san/core/entities/view-common'

import { computed } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'
import { operations } from '../composables/filter'

const props = defineProps({
    modelValue: {
        type: Object as () => ViewFilter,
        default: () => ({}),
    },
    column: {
        type: Object as () => Column,
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
            :options="column.options"
            label-key="name"
            value-key="name"
            class="w-full"
            menu:offset-y
        />
    </div>
</template>
