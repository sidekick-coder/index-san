<script setup lang="ts">
import { useCollection } from '@/composables/collection'
import { ref, watch } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    column: {
        type: Object as () => any,
        default: () => ({})
    },
    workspaceId: {
        type: String,
        required: true,
    },
    collectionId: {
        type: String,
        required: true,
    }
})

const emit = defineEmits(['update:modelValue', 'save'])
const collection = useCollection(props.workspaceId, props.collectionId)

const model = useVModel(props, 'modelValue', emit)
const edited = useVModel(props, 'column', emit)

const payload = ref({
    label: '',
    field: ''
})

async function submit(){

    if (!edited.value) {
        await collection.addColumn(payload.value)
    }

    if (edited.value) {
        await collection.updateColumn(edited.value.id, payload.value)
    }

    model.value = false

    emit('save')
}

async function deleteColumn(){
    await collection.deleteColumn(edited.value.id)

    emit('save')
    
    model.value = false
}

watch(model, value => {
    if (!value) {
        edited.value = null
        Object.keys(payload.value).forEach(key => {
            payload.value[key] = ''
        })
        return
    }

    if (edited.value) {
        Object.keys(edited.value).forEach(key => {
            payload.value[key] = edited.value[key]
        })
    }
})

</script>

<template>
    <w-dialog v-model="model">
        <template #content>
            <w-form class="w-full bg-gray-800 max-w-[500px] p-4" @click.stop="" @submit="submit">
                <div class="flex items-center mb-5 ">
                    <div class="text-xl text-gray-500">
                        Edit column
                    </div>

                    <div class="ml-auto text-sm text-gray-500" v-if="edited">
                        <i class="cursor-pointer" @click="deleteColumn">
                            <fa-icon icon="trash" />
                        </i>
                    </div>
                </div>

                <div class="mb-4">
                    <w-input
                        v-model="payload.label"
                        label="Label"
                        placeholder="Project status"
                    />
                </div>
                
                <div class="mb-4">
                    <w-input
                        v-model="payload.field"
                        label="Field"
                        placeholder="project_status"
                        :disabled="!!edited"
                    />
                </div>
        
                <div>
                    <w-btn class="w-full" >Submit</w-btn>
                </div>
            </w-form>
        </template>
    </w-dialog>
</template>