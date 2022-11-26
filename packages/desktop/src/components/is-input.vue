<script setup>
import { useVModel } from 'vue-wind/composables/v-model'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})
const emit = defineEmits(['update:modelValue'])

const model = useVModel(props, 'modelValue', emit)
</script>
<template>
    <input
        v-bind="$attrs"
        v-model="model"
        class="py-2 px-4 bg-b-primary rounded focus:outline focus:outline-2 focus:outline-accent w-full"
    />
</template>
