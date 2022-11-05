<script lang="ts" setup>
import { useCollection } from '@/composables/collection'
import { usePageMeta } from '@/composables/page-meta'

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
const collection = useCollection(props.workspaceId, props.collectionId)


collection.show().then(c => meta.value.title = c.name)


</script>
<template>
    <is-collection :workspace-id="workspaceId" :collection-id="collectionId">
        <is-table :limit="100" />
    </is-collection>
</template>