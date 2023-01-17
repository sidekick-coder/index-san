<script setup lang="ts">
import { ref, computed } from 'vue'
import { createValue } from '../composables/value'
import moment from 'moment'
import { useModelOrInnerValue } from '@/composables/model'

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
    edit: {
        type: Boolean,
        default: null,
    },
})

const emit = defineEmits(['update:edit'])

const { payload, column, onLoaded, save } = createValue(props)

await new Promise<void>((resolve) => onLoaded(resolve))

function isValid(value: any) {
    if (!column.value) return true

    return moment(value, column.value.saveFormat, true).isValid()
}

// display
const display = computed(() => {
    if (!payload.value || !column.value) return ''

    const { saveFormat, displayFormat } = column.value

    return moment(payload.value, saveFormat).format(displayFormat)
})

// edit model

const editModel = useModelOrInnerValue(props, 'edit', emit)
</script>

<template>
    <v-input
        v-if="editModel"
        v-model="payload"
        autofocus
        @update:model-value="save"
        @blur="editModel = false"
    />

    <div
        v-else
        :model-value="display"
        :class="!isValid(payload) ? 'text-danger cursor-pointer' : 'cursor-pointer'"
        class="cursor-pointer"
        @click="editModel = true"
    >
        {{ display }}
    </div>
</template>
