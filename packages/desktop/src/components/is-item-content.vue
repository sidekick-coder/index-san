<script setup lang="ts">
import { useItemRepository } from '@/composables/item'
import { ref, watch } from 'vue'


const props = defineProps({
    workspaceId: {
        type: String,
        required: true
    },
    collectionId: {
        type: String,
        required: true
    },
    itemId: {
        type: String,
        default: null
    },
})

const content = ref('')
const itemRepository = useItemRepository(props.workspaceId, props.collectionId)

async function load(){
    if (!props.itemId) return
    
    await itemRepository.show(props.itemId)
        .then(i => {
            console.log(i)
            content.value = i._content ? i._content.text : ''
        })
}

async function save(){
    await itemRepository.update(props.itemId, {
        _content: {
            text: content.value
        }
    })
}

watch(props, load, { immediate: true, deep: true })

</script>
<template>
    <textarea
        v-model="content"
        class="w-full bg-transparent outline-none min-h-[100px]" 
        placeholder="Content..."
        @change="save"
    >

    </textarea>
</template>