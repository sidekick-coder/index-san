<script setup lang="ts">
import { ref, watch } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

import { CollectionColumn } from '@core/entities/collection'

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: false,
    },
    columns: {
        type: Array as () => CollectionColumn[],
        default: () => [],
    },
    filters: {
        type: Object,
        default: () => ({}),
    },
})

const emit = defineEmits(['submit', 'update:view', 'update:modelValue'])
const model = useVModel(props, 'modelValue', emit)

const payload = ref({})

function submit() {
    const filters = {}

    props.columns.forEach((column) => {
        filters[column.field] = payload.value[column.field] || ''
    })

    emit('submit', filters)

    model.value = false
}

function load() {
    if (props.filters) {
        Object.keys(props.filters).forEach((key) => {
            payload.value[key] = props.filters[key]
        })
    }
}

function clear() {
    const filters = {}

    props.columns.forEach((column) => {
        filters[column.field] = ''
    })

    emit('submit', filters)

    model.value = false
}

watch(() => props.filters, load, { immediate: true, deep: true })
</script>
<template>
    <teleport to="body">
        <div
            v-if="model"
            class="fixed inset-0 flex h-screen w-screen bg-black/30"
            @click="model = false"
        >
            <aside
                class="fixed right-0 top-0 h-full border-l border-gray-700 w-[500px] bg-zinc-800"
                @click.stop=""
            >
                <w-form class="flex flex-wrap px-4 py-4" @submit="submit">
                    <div v-for="(column, index) in columns" :key="index" class="w-full mb-4">
                        <w-select
                            v-if="column.type === 'select'"
                            v-model="payload[column.field]"
                            :label="column.label"
                            :options="column.options.split(',')"
                        />

                        <w-input
                            v-else
                            v-model="payload[column.field]"
                            :label="column.label"
                            class="text-white"
                        />
                    </div>

                    <div class="flex justify-between w-full">
                        <w-btn type="submit" class="w-5/12" color="teal">Apply</w-btn>
                        <w-btn type="button" class="w-5/12" @click="clear">Clean</w-btn>
                    </div>
                </w-form>
            </aside>
        </div>
    </teleport>
</template>
