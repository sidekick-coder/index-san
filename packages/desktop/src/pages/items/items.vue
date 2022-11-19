<script lang="ts" setup>
import { useCollectionAsync } from '@/composables/collection'
import { usePageMeta } from '@/composables/page-meta'
import { watch } from 'vue'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    collectionId: {
        type: String,
        required: true,
    }
})

const meta = usePageMeta()

async function load(){
    const collection = await useCollectionAsync(props.workspaceId, props.collectionId) 
    
    meta.value.title = collection.value?.name ?? `collection ${props.collectionId}`
}

watch(() => props, load, {
    immediate: true,
    deep: true
})

</script>
<template>    
    <is-collection-table :workspace-id="workspaceId" :collection-id="collectionId" view-id="default" />    
</template>