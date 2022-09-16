<script setup lang="ts">
import { ref } from 'vue';
import { useWorkspace } from '../../stores/workspaces'

const store = useWorkspace()

const columns = [
    {
        name: 'name',
        field: 'name'
    },
    {
        name: 'path',
        field: 'path'
    },
    {
        name: 'actions',
        field: 'actions'
    },
]

const payload = ref({
    name: '',
    path: '',
    drive: 'fs'
})

async function submit(){
    await store.create(payload.value)

    await store.setAll()

    payload.value.name = ''
    payload.value.path = ''
}

async function deleteItem(id: string) {
    await store.delete(id)

    await store.setAll()
}

</script>
<template>
    <div class="p-10">
        <div class="text-2xl mb-4">Workspace List</div>

        <w-form @submit="submit">
            <div class="mb-4">
                <w-input v-model="payload.name" label="Name" />
            </div>
            
            <div class="mb-4">
                <w-input v-model="payload.path" label="Path" />
            </div>

            <w-btn :disabled="!payload.name || !payload.path" class="w-full" >Add</w-btn>
        </w-form>

        <w-data-table
            :columns="columns"
            :items="store.all"
        >
        <template #item-actions="{ item }">
            <w-btn @click="deleteItem(item.id)" >Delete</w-btn>
        </template>
    
        </w-data-table>
    </div>
</template>