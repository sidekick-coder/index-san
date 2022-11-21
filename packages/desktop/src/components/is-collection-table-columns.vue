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
    hiddenColumns: {
        type: Array as () => string[],
        default: () => [],
    },
})

const emit = defineEmits(['submit', 'update:modelValue'])
const model = useVModel(props, 'modelValue', emit)

const payload = ref<string[]>([])

function submit() {
    emit('submit', payload.value.slice())

    model.value = false
}

function load() {
    payload.value = props.hiddenColumns.slice()
}

function clear() {
    emit('submit', [])

    model.value = false
}

function toggle(column: CollectionColumn) {
    const index = payload.value.indexOf(column.id)

    if (index !== -1) {
        payload.value.splice(index, 1)
    }

    if (index === -1) {
        payload.value.push(column.id)
    }
}

watch(
    model,
    () => {
        if (model.value) load()
    },
    { immediate: true, deep: true }
)
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
                <w-form class="flex flex-wrap" @submit="submit">
                    <div
                        v-for="(column, index) in columns"
                        :key="index"
                        class="w-full mb-4 flex items-center text-white hover:bg-gray-500 px-4 py-2 cursor-pointer"
                        @click="toggle(column)"
                    >
                        <is-icon v-if="payload.includes(column.id)" name="eye-slash" />

                        <is-icon v-else name="eye" />

                        <div class="ml-4">
                            {{ column.label }}
                        </div>
                    </div>

                    <div class="flex justify-between w-full px-4 py-2">
                        <w-btn type="submit" class="w-5/12" color="teal">Apply</w-btn>
                        <w-btn type="button" class="w-5/12" @click="clear">Clean</w-btn>
                    </div>
                </w-form>
            </aside>
        </div>
    </teleport>
</template>
