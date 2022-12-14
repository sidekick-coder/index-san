<script setup lang="ts">
import get from 'lodash/get'
import set from 'lodash/set'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVModel } from 'vue-wind/composables/v-model'
import { Filter, FilterTextConfig } from '../composables/filter'

const props = defineProps({
    modelValue: {
        type: Object as () => Filter,
        default: () => ({}),
    },
})

const emit = defineEmits(['update:modelValue'])

// set value
const model = useVModel(props, 'modelValue', emit)

const type = computed<FilterTextConfig['type']>({
    get() {
        return get(model.value, 'config.type', 'equal')
    },
    set(value) {
        set(model.value, 'config.type', value)
    },
})

type.value = 'equal'

// options
const tm = useI18n()

interface Option {
    label: string
    value: FilterTextConfig['type']
}

const options: Option[] = [
    {
        label: tm.t('equal'),
        value: 'equal',
    },
    {
        label: tm.t('notEqual'),
        value: 'not-equal',
    },
]
</script>
<template>
    <is-select
        v-model="type"
        menu:offset-y
        :label="$t('type')"
        :options="options"
        label-key="label"
        value-key="value"
        class="mb-4 w-full"
    />

    <is-input v-model="model.value" :label="$t('value')" class="w-full" />
</template>
