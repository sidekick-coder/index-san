<script lang="ts">
export default {
    inheritAttrs: true,
}
</script>

<script setup lang="ts">
import { useVariant } from '@composables/use-variant'
import { useVModel } from 'vue-wind/composables/v-model'

// Props & Emits
const props = defineProps({
    modelValue: {
        type: [String, Number, Boolean] as any,
        default: null,
    },
    label: {
        type: String,
        default: null,
    },
    color: {
        type: String,
        default: 'accent',
    },
})

const emit = defineEmits(['update:modelValue'])

// model
const model = useVModel(props, 'modelValue', emit)

// color

const colorVariant = useVariant(props, 'color', {
    accent: 'text-accent',
    _shared: 'cursor-pointer',
})
</script>
<template>
    <label class="flex items-center cursor-pointer w-full">
        <input
            v-model="model"
            type="checkbox"
            class="hidden"
        >

        <v-icon
            v-if="model"
            :class="colorVariant.classes"
            :style="colorVariant.styles"
            name="square-check"
        />

        <v-icon
            v-else
            name="fa-regular fa-square"
            class="text-t-secondary"
        />

        <span
            v-if="label"
            class="text-t-secondary block font-bold ml-2"
        >{{ label }}</span>
    </label>
</template>
