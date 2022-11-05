<script setup lang="ts">
import { definePageMeta } from '@/composables/page-meta'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkspace } from '../../stores/workspaces'

definePageMeta({
    title: 'Workspace list'
})

const store = useWorkspace()
const router = useRouter()

const columns = [
    {
        label: 'Id',
        name: 'id',
        field: 'id'
    },
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

const payload = ref<any>({
    id:  '',
    name: '',
    path: '',
})

function load(){
    store.setAll()
}

load()

async function submit(){
    await store.create({
        id: payload.value.id,
        name: payload.value.name,
        drive: 'fs',
        config: {
            path: payload.value.path
        }
    })

    load()

    Object.keys(payload.value).forEach(key => {
        payload.value[key] = ''
    })
}

async function deleteItem(id: string) {
    await store.delete(id)

    load()
}

async function showItem(workspaceId: string){
    await router.push(`/workspaces/${workspaceId}`)
}

</script>
<template>
    <div class="pt-10">
        <w-form @submit="submit" class="mb-4">
            <div class="mb-4">
                <w-input
                    v-model="payload.id" label="Id"
                    placeholder="my-workspace"
                />
            </div>

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
            <div class="flex">
                <w-btn @click="showItem(item.id)" class="mr-2" >
                    <fa-icon icon="eye" />
                </w-btn>
    
                <w-btn @click="deleteItem(item.id)" >
                    <fa-icon icon="trash" />
                </w-btn>
            </div>
        </template>
    
        </w-data-table>
    </div>
</template>