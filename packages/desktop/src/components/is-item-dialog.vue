<script setup lang="ts">
import { ref, watch } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    item: {
        type: Object as () => any,
        default: () => ({})
    },
    columns: {
        type: Array as () => any[],
        default: () => []
    }

})
const emit = defineEmits(['update:modelValue', 'save', 'delete'])

const model = useVModel(props, 'modelValue', emit)
const payload = ref({})

function onChange(){
    emit('save', payload.value)
}

watch(model, (value) => {
    if (!value) {
        payload.value = {}
        return
    }

    props.columns.forEach(c => payload.value[c.field] = props.item[c.field])
})


</script>
<template>
    <w-dialog v-model="model">
        <template #content>
            <div
                class="p-5 w-full max-w-[500px] transition  ease-in-out bg-gray-800 text-white rounded"
                @click.stop=""
            >

            <div class="flex items-center mb-5 ">
                <div class="text-xl text-gray-500">
                    Edit item
                </div>

                <div class="ml-auto text-sm text-gray-500">
                    <i class="cursor-pointer" @click="$emit('delete')">
                        <fa-icon icon="trash" />
                    </i>
                </div>
            </div>

                <div v-for="column in columns" :key="column.id" class="mb-4 last:mb-0" >
                    <w-input
                        v-model="payload[column.field]"
                        :label="column.label"
                        @change="onChange"
                    />
                </div>
            </div>
        </template>
    </w-dialog>
</template>