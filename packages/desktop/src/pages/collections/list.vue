<script setup lang="ts">
import Collection from '@core/entities/collection'

import { useCollections } from '@/composables/collection'
import { onMounted, ref } from 'vue'
import { useWorkspace } from '../../stores/workspaces'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true
    }
})

const collections = useCollections(props.workspaceId)

const items = ref<Collection[]>([])
const columns = [
    {
        label: 'Name',
        name: 'name',
        field: 'name'
    },
    {
        label: 'Crud',
        name: 'crudName',
        field: 'crudName'
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

async function load(){
    await collections.list().then(({ data }) => (items.value = data))
}

onMounted(load)
    
async function submit(){
    const { name, path } = payload.value

    await collections.create({crudName: 'fs-folder', name, path })
    
    await load()
    
    payload.value.name = ''
    payload.value.path = ''
}
    
async function deleteItem(id: string) {
    await collections.destroy(id)

    await load()
}
    
</script>
    <template>
        <div class="p-10">
            <div class="text-2xl mb-4">Collections List</div>
    
            <w-form @submit="submit" class="mb-4">
                <div class="mb-4">
                    <w-input
                        v-model="payload.name"
                        label="Name"
                        placeholder="Collection-01"
                    />
                </div>
                
                <div class="mb-4">
                    <w-input
                        v-model="payload.path"
                        label="Path"
                        placeholder="/collections/collection-01"
                    />
                </div>
    
                <w-btn :disabled="!payload.name || !payload.path" class="w-full" >Add</w-btn>
            </w-form>
    
            <w-data-table
                :columns="columns"
                :items="items"
            >
    
            <template #item-actions="{ item }">
                <w-btn @click="deleteItem(item.id)" >
                    <fa-icon icon="trash" />
                </w-btn>
            </template>
        
            </w-data-table>
        </div>
    </template>