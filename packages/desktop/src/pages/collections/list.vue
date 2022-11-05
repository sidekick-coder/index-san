<script setup lang="ts">
import Collection from '@core/entities/collection'

import { useCollectionRepository } from '@/composables/collection'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { definePageMeta } from '@/composables/page-meta'

definePageMeta({
    title: 'Collection list'
})

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
        label: 'ID',
        name: 'id',
        field: 'id'
    },
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
    
const payload = ref<any>({
    id: '',
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
        id: payload.value.id,
        crudName: 'fsFolder',
        name,
        path,
        columns: []
    })
    
    await load()
    
    Object.keys(payload.value).forEach(key => {
        payload.value[key] = ''
    })
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
        <div class="py-10">    
            <w-form @submit="submit" class="mb-4">
                <div class="mb-4">
                    <w-input
                        v-model="payload.id"
                        label="ID"
                        placeholder="collection-01"
                    />
                </div>

                <div class="mb-4">
                    <w-input
                        v-model="payload.name"
                        label="Name"
                        placeholder="Collection 01"
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