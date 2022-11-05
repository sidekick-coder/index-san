<script lang="ts" setup>
import { useCollection, useCollectionAsync } from '@/composables/collection'
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

watch(() => props.collectionId, load, {
    immediate: true,
})


</script>
<template>
    <is-collection :workspace-id="workspaceId" :collection-id="collectionId">
        <is-table :limit="20" />
    </is-collection>
</template>