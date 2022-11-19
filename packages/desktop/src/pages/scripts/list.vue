<script setup lang="ts">
import { computed, ref } from 'vue'

import { definePageMeta } from '@/composables/page-meta'
import Script from '@core/entities/script'
import { useCase } from '@/composables/use-case'
import { useRouter } from 'vue-router'

definePageMeta({
    title: 'Scripts list'
})

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
})

const router = useRouter()

const items = ref<Script[]>([])
const search = ref('')
const dialog = ref(false)
const payload = ref({
    name: '',
    content: ''
})

const filteredItems = computed(() => items.value.filter(i => i.name.match(search.value)))


const columns = [
    {
        name: 'name',
        label: 'Name',
        field: 'name'
    }
]

async function setItems(){
    await useCase('list-scripts', { workspaceId: props.workspaceId })
        .then(({ data }) => items.value = data)
}

setItems()

async function submit(){
    await useCase('create-script', {
        workspaceId: props.workspaceId,
        data: payload.value
    })

    payload.value.name = ''

    await setItems()

    dialog.value = false
}


async function onItemDelete(item: Script) {
    await useCase('delete-script', {
        workspaceId: props.workspaceId,
        name: item.name
    })

    await setItems()
}

async function onItemShow(item: Script){
    await router.push(`/workspaces/${props.workspaceId}/scripts/${item.name}`)
}

</script>
<template>

    <is-dialog v-model="dialog">
        <w-form @submit="submit">
            <div class="mb-4">
                <w-input v-model="payload.name" label="Name" />
            </div>

            <div>
                <w-btn>Create</w-btn>
            </div>
        </w-form>
    </is-dialog>

    <div class="w-full mt-5 pb-5 border-b border-zinc-700 flex items-center">
        
        <is-input
            v-model="search"
            placeholder="Search..." 
            class="max-w-[300px]"
        />

        <w-btn class="ml-auto" @click="dialog = true">
            {{ $t('addEntity', ['script']) }}
        </w-btn>
    </div>

    <is-table
        :columns="columns"
        :items="filteredItems"
        disable-add-column
        disable-new-item
        @item:show="onItemShow"
        @item:delete="onItemDelete"
    >

    </is-table>
</template>