<script setup lang="ts">
import { CollectionColumn } from '@/../core/entities/collection'
import get from 'lodash/get'
import set from 'lodash/set'

import { computed } from 'vue'
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

const operation = computed<keyof typeof operations.script>({
    get() {
        return get(model.value, 'config.operation')
    },
    set(value) {
        set(model.value, 'config.operation', value)
    },
})

if (!operation.value) operation.value = '='

const options = Object.keys(operations.script).map((key) => ({
    label: key,
    value: key,
}))
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

        <is-input v-model="model.value" :placeholder="$t('value')" input:autofocus class="grow" />
    </div>
</template>
