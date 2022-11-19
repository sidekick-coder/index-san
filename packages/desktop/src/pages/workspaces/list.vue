<script setup lang="ts">
import { definePageMeta } from '@/composables/page-meta'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWorkspace } from '../../stores/workspaces'

const store = useWorkspace()
const tm = useI18n()

const meta = definePageMeta({
    title: tm.t('listEntity', [tm.t('workspace', 2)])
})

const columns = [
    {
        label: 'Id',
        name: 'id',
        field: 'id'
    },
    {
        label: tm.t('name'),
        name: 'name',
        field: 'name'
    },
    {
        label: tm.t('path'),
        name: 'path',
        field: 'path'
    },
    {
        name: 'actions',
        field: 'actions'
    },
]

const dialog = ref(false)
const payload = ref<any>({
    id:  '',
    name: '',
    path: '',
})

function load(){
    return store.setAll()
}

load()

async function submit(){
    await store.create({
        id: payload.value.id,
        name: payload.value.name,
        driveName: 'fs',
        config: {
            path: payload.value.path
        }
    })

    await load()

    Object.keys(payload.value).forEach(key => {
        payload.value[key] = ''
    })

    dialog.value = false
}

async function deleteItem(id: string) {
    await store.delete(id)

    load()
}

</script>
<template>
    <div>
        <is-dialog v-model="dialog">
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
        </is-dialog>

        <div class="w-full py-5 border-b border-gray-700 flex items-center">
            <div class="text-2xl font-bold">
                {{ meta.title }}
            </div>
            <w-btn class="ml-auto" color="teal" @click="dialog = true" >
                {{$t('addEntity', [$t('workspace')])}}
            </w-btn>
        </div>

        <is-table
            :columns="columns"
            :items="store.all"
            :fixed="false"
        >
            <template #item-path="{ item }">
                <div class="p-2">
                    {{ item.config.path }}
                </div>
            </template>

            <template #item-actions="{ item }">
                <div class="flex gap-x-2 p-2">
                    <w-btn size="sm" @click="$router.push(`/workspaces/${item.id}/scripts`)" class="mr-2" >
                        <is-icon name="code" />
                    </w-btn>

                    <w-btn size="sm" @click="$router.push(`/workspaces/${item.id}/collections`)" class="mr-2" >
                        <is-icon name="database" />
                    </w-btn>
                    
                    <w-btn size="sm" @click="$router.push(`/workspaces/${item.id}/entries`)" class="mr-2" >
                        <is-icon name="folder" />
                    </w-btn>
        
                    <w-btn size="sm" @click="deleteItem(item.id)" >
                        <fa-icon icon="trash" />
                    </w-btn>
                </div>
            </template>
    
    </is-table>
    </div>
</template>