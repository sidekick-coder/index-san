<script setup lang="ts">
import { ref } from 'vue'
import { useWorkspace } from '../../stores/workspaces'

const store = useWorkspace()

const columns = [
    {
        label: 'Name',
        name: 'name',
        field: 'name'
    },
    {
        label: 'Path',
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
})

async function submit(){
    await store.create({
        name: payload.value.name,
        drive: 'fs',
        config: {
            path: payload.value.path
        }
    })

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

        <w-form @submit="submit" class="mb-4">
            <div class="mb-4">
                <w-input
                    v-model="payload.name" label="Name"
                    placeholder="My Workspace"
                />
            </div>
            
            <div class="mb-4">
                <w-input
                    v-model="payload.path"
                    label="Path"
                    placeholder="C:\Users\Work\Desktop\My-Workspace"
                />
            </div>

            <w-btn :disabled="!payload.name || !payload.path" class="w-full" >Add</w-btn>
        </w-form>

        <w-data-table
            :columns="columns"
            :items="store.all"
        >
        <template #item-path="{ item }">
            {{ item.config.path }}
        </template>

        <template #item-actions="{ item }">
            <w-btn @click="deleteItem(item.id)" >
                <fa-icon icon="trash" />
            </w-btn>
        </template>
    
        </w-data-table>
    </div>
</template>