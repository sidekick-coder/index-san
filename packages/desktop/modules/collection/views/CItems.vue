<script lang="ts" setup>
import { useCollection } from '@/composables/collection'
import { useMeta } from '@/composables/metas'
import { watch } from 'vue'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    collectionId: {
        type: String,
        required: true,
    },
})

const meta = useMeta()

const [collection, setCollection] = useCollection()

async function load() {
    await setCollection(props.workspaceId, props.collectionId)

    meta.value.title = collection.value?.name ?? `collection ${props.collectionId}`
}

watch(() => props, load, {
    immediate: true,
    deep: true,
})
</script>
<template>
    <is-container class="overflow-auto h-full pb-10">
        <is-collection-table
            :workspace-id="workspaceId"
            :collection-id="collectionId"
            :title="meta.title"
            view-id="default"
        />
    </is-container>
</template>
