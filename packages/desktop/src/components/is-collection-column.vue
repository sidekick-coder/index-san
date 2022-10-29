<script setup lang="ts">
import { useCollection } from '@/composables/collection'
import { CollectionColumn } from '@core/entities/collection'
import { ref, watch } from 'vue'


const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    collectionId: {
        type: String,
        required: true,
    },
    column: {
        type: Object as () => CollectionColumn,
        required: true,
    }
})

const collection = useCollection(props.workspaceId, props.collectionId)
const types = [
    {
        label:'Text',
        value: 'text'
    },
    {
        label:'Number',
        value: 'number'
    },
    {
        label:'Select',
        value: 'select'
    },
    {
        label:'Entry',
        value: 'entry'
    },
]

const dialog = ref(false)
const payload = ref({
    label: '',
    field: '',
    type: 'text',
    options: undefined
})

const icons = {
    text: 'font',
    number: 'hashtag',
    select: 'fa-regular fa-square-caret-down'
}

function load(){
    Object.keys(payload.value).forEach(key => {
        payload.value[key] = props.column[key]
    })
}

watch(() => props.column, load, { immediate: true, deep: true })

async function submit(){

    if (payload.value.type !==  'select') {
        payload.value.options = undefined
    }

    await collection.updateColumn(props.column.id, payload.value)

    dialog.value = false
}

async function deleteColumn(){
    await collection.deleteColumn(props.column.id)

    dialog.value = false
}


</script>
<template>
    <w-dialog v-model="dialog">
        <template #content>
            <w-form class="w-full bg-gray-800 max-w-[500px] p-4" @click.stop="" @submit="submit">
                <div class="flex items-center mb-5 ">
                    <div class="text-xl text-gray-500">
                        Edit column
                    </div>

                    <div class="ml-auto text-sm text-gray-500">
                        <i class="cursor-pointer" @click="deleteColumn">
                            <fa-icon icon="trash" />
                        </i>
                    </div>
                </div>

                <div class="mb-4">
                    <w-input v-model="payload.label" label="Label" />
                </div>
                
                <div class="mb-4">
                    <w-select
                        v-model="payload.type"
                        label="Type"
                        :options="types"
                        label-key="label"
                        value-key="value"
                    />
                </div>

                <div class="mb-4" v-if="payload.type === 'select'">
                    <w-input
                        v-model="payload.options"
                        label="Options (separate by comma)"
                        :options="types"
                        label-key="label"
                        value-key="value"
                        placeholder="item-01,item-02"
                    />
                </div>

                <div class="mb-4">
                    <w-input v-model="payload.field" label="Field" />
                </div>
        
                <div>
                    <w-btn class="w-full" >Submit</w-btn>
                </div>
            </w-form>
        </template>
    </w-dialog>

    <div @click="dialog = true" class="cursor-pointer text-gray-500 text-sm ">
        <fa-icon :icon="icons[column.type] || 'font' " class="mr-1 text-xs" />

        {{ column.label }}
    </div>
</template>