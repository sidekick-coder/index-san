<script setup lang="ts">
import { ref, watch } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'


const props = defineProps({
    modelValue: {
        type: Boolean,
        required: false
    },
    columns: {
        type: Array as () => any[],
        default: () => []
    },
    initialFilters: {
        type: Object,
        default: () => ({})
    }
})


const emit = defineEmits(['submit', 'update:filters', 'update:modelValue'])
const model = useVModel(props, 'modelValue', emit)
const payload = ref({})

Object.keys(props.initialFilters).forEach(key => {
    payload.value[key] = props.initialFilters[key]
})

function submit(){
    emit('submit', payload.value)
    
    model.value = false
}

function clear(){
    payload.value = {}

    emit('submit', {})

    model.value = false
}

</script>
<template>
    <teleport to="body">
        <div
            v-if="model"
            class="fixed inset-0 flex h-screen w-screen bg-black/30"
            @click="model = false"
        >
            <aside
                class="fixed right-0 top-0 h-full border-l border-gray-700 w-[300px] bg-zinc-800"
                @click.stop=""
            >
                <w-form class="flex flex-wrap px-4 py-4" @submit="submit">
                    <div class="w-full mb-4" v-for="(column, index) in columns" :key="index">
                        <w-select
                            v-if="column.type === 'select'"
                            v-model="payload[column.field]"
                            :label="column.label"
                            :options="column.options.split(',')"
                        />

                        <w-select
                            v-else-if="column.type === 'relation'"
                            v-model="payload[column.field]"
                            :label="column.label"
                            :options="Array.from(column.options.entries())"
                            label-key="1"
                            value-key="0"
                        />

                        <w-input
                            v-else
                            v-model="payload[column.field]"
                            :label="column.label"
                            class="text-white"
                        />
                    </div>

                    <div class="flex justify-between w-full">
                        <w-btn type="submit" class="w-5/12" color="teal" >Apply</w-btn>
                        <w-btn type="button" class="w-5/12" @click="clear" >Clean</w-btn>
                    </div>
                </w-form>
            </aside>
        </div>
    </teleport>
</template>