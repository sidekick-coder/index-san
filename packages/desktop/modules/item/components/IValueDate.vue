<script setup lang="ts">
import { ref, computed } from 'vue'

import moment from 'moment'

import { useVModel } from '@vueuse/core'
import Column from '@/../core/entities/column'

const props = defineProps({
    modelValue: {
        type: String,
        default: null,
    },
    column: {
        type: Object as () => Column,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue'])

// model
const model = useVModel(props, 'modelValue', emit)

const edit = ref(false)

function isValid(value: string) {
    return moment(value, props.column.saveFormat, true).isValid()
}

// display
const display = computed(() => {
    if (!model.value) return ''

    return moment(model.value, props.column.saveFormat).format(props.column.displayFormat)
})
</script>

<template>
    <v-input v-if="edit" v-model="model">
        <template #append>
            <v-btn size="text-xs px-2 " text @click="edit = false">
                <v-icon name="check" />
            </v-btn>
        </template>
    </v-input>

    <v-input
        v-else
        :model-value="display"
        class="cursor-pointer group/input"
        :input:class="!isValid(model) ? 'text-danger cursor-pointer' : 'cursor-pointer'"
        readonly
    >
        <template #append>
            <v-btn
                size="text-xs px-2  group-hover/input:opacity-100 opacity-0"
                text
                @click.stop="edit = true"
            >
                <v-icon name="pen" />
            </v-btn>
        </template>
    </v-input>
</template>
