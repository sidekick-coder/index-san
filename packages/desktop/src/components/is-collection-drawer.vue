<script setup lang="ts">
import { CollectionColumn } from '@core/entities/collection'
import { ref, unref, watch } from 'vue'
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
    view: {
        type: Object,
        default: () => ({})
    }
})


const emit = defineEmits(['submit', 'update:view', 'update:modelValue'])
const model = useVModel(props, 'modelValue', emit)

const payload = ref({
    filters: {},
    hiddenColumns: [] as string[]
})

function submit(){

    const filters = {}

    Object.keys(payload.value.filters).forEach(key => {
        filters[key] = payload.value[key]
    })

    emit('submit', {
        filters,
        hiddenColumns: payload.value.hiddenColumns.slice()
    })
    
    model.value = false
}

function load(){
    if (props.view.filters) {
        Object.keys(props.view.filters).forEach(key => {
            payload.value.filters[key] = props.view.filters[key]
        })
    }

    if (props.view.hiddenColumns) {
        payload.value.hiddenColumns = props.view.hiddenColumns.slice()
    }
}

function clear(){
    load()

    model.value = false
}

function toggleColumn(column: CollectionColumn) {

    const index = payload.value.hiddenColumns.indexOf(column.id)

    if (index === -1) {
        payload.value.hiddenColumns.push(column.id)
    }
    
    if (index !== -1) {
        payload.value.hiddenColumns.splice(index, 1)
    }
}

watch(() => props.modelValue, (v) => {
    if (v) load()
}, { immediate: true, deep: true })

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

            <is-tab>

                <is-tab-item label="Filters">
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
                </is-tab-item>

                <is-tab-item label="Visible columns" >
                    <div class="flex flex-wrap px-4 py-4" @submit="submit">
                        <div class="w-full mb-4" v-for="(column, index) in columns" :key="index">
                            <label class="text-white">
                                <is-icon
                                    :name="payload.hiddenColumns.includes(column.id) ? 'eye-slash' : 'eye' "
                                    @click="toggleColumn(column)"
                                />
                                {{column.label}}
                            </label>
                        </div>

                        <div class="flex justify-between w-full">
                            <w-btn
                                type="submit"
                                class="w-5/12"
                                color="teal"
                                @click="submit"
                                >
                                Apply
                            </w-btn>
                            <w-btn type="button" class="w-5/12" @click="clear" >Clean</w-btn>
                        </div>
                    </div>
                </is-tab-item>

            </is-tab>

                
            </aside>
        </div>
    </teleport>
</template>