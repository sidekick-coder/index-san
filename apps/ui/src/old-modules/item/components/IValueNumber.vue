<script setup lang="ts">
import { useModelOrInnerValue } from '@composables/model'
import { createValue } from '@modules/item/composables/value'

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

const { payload, save, onLoaded } = createValue({
    collectionId: props.collectionId,
    columnId: props.columnId,
    itemId: props.itemId,
})

await new Promise<void>((resolve) => onLoaded(resolve))

// edit mode

const editModel = useModelOrInnerValue(props, 'edit', emit)
</script>

<template>
    <div
        v-if="!edit"
        class="cursor-pointer"
        @click="editModel = true"
    >
        {{ payload }}
    </div>

    <v-input
        v-else
        v-model="payload"
        type="number"
        autofocus
        @update:model-value="save"
        @blur="editModel = false"
    />
</template>
