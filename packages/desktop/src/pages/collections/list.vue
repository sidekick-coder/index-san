<script setup lang="ts">
import Collection from '@core/entities/collection'

import { useCollectionRepository } from '@/composables/collection'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true
    }
})

const router = useRouter()
const repository = useCollectionRepository(props.workspaceId)

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
    await repository.list().then(({ data }) => (items.value = data))
}

onMounted(load)
    
async function submit(){
    const { name, path } = payload.value

    await repository.create({
        crudName: 'fsFolder',
        name,
        path,
        columns: [
            {
                id: '1',
                label: 'filename',
                field: '_filename',
                readonly: true
            }
        ]
    })
    
    await load()
    
    payload.value.name = ''
    payload.value.path = ''
}
    
async function deleteItem(id: string) {
    await repository.destroy(id)

    await load()
}

async function viewItem(collectionId: string){
    const { workspaceId } = props

    await router.push(`/workspaces/${workspaceId}/collections/${collectionId}/items`)
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
                <div class="flex gap-x-4">
                    <w-btn @click="viewItem(item.id)" >
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