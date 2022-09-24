<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const payload = ref({
    label: '',
    field: ''
})


function submit(){
    emit('submit', payload.value)

    payload.value.label = ''
    payload.value.field = ''
}

</script>
<template>
    <w-dialog>
        <template #content>
            <w-form class="w-full bg-gray-800 max-w-[500px] p-4" @click.stop="" @submit="submit">
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
                    />
                </div>
        
                <div class="mb-4">
                    <w-btn class="w-full" >Submit</w-btn>
                </div>
            </w-form>
        </template>
    </w-dialog>
</template>