<script setup lang="ts">
import { useVModel } from 'vue-wind/composables/v-model'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },

})

const emit = defineEmits(['update:modelValue', 'save', 'delete'])

const model = useVModel(props, 'modelValue', emit)

</script>
<template>
    <w-dialog v-model="model">
        <template #content>
            <div
                class="p-5 w-full max-w-[500px] transition  ease-in-out bg-gray-800 text-white rounded"
                @click.stop=""
            >

               <slot />
            </div>
        </template>
    </w-dialog>
</template>