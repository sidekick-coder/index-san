<script lang="ts">
export default {
    inheritAttrs: true,
}
</script>

<script setup lang="ts">
import { useVModel } from 'vue-wind/composables/v-model'

// Props & Emits
const props = defineProps({
    modelValue: {
        type: [String, Number, Boolean] as any,
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

// model
const model = useVModel(props, 'modelValue', emit)
</script>
<template>
    <div class="flex items-center">
        <input v-model="model" type="checkbox" class="w-4 h-4 text-white accent-accent" />
    </div>
</template>
