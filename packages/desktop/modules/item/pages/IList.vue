<script lang="ts" setup>
import { useMeta } from '@/composables/metas'
import { useStore as useCollection } from '@/modules/collection/store'
import { useStore as useWorkspace } from '@/modules/workspace/store'

import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import CViewGroup from '@/modules/collection/components/CViewGroup.vue'

const props = defineProps({
    collectionId: {
        type: String,
        required: true,
    },
})

const collectionStore = useCollection()
const workspaceStore = useWorkspace()

const collection = computed(() =>
    collectionStore.collections.find((c) => c.id === props.collectionId)
)

// redirect to 404 if not have collection
const router = useRouter()

if (!collection.value) {
    router.push('/404')
}

// set meta
const meta = useMeta({ title: collection.value?.name ?? 'collection' })

function load() {
    meta.value.title = collection.value?.name ?? props.collectionId
}

watch(() => props.collectionId, load, {
    immediate: true,
})
</script>
<template>
    <div v-if="collection" class="w-full h-full">
        <c-view-group
            :collection-id="collectionId"
            :title="meta.title"
            view-id="default"
            height="100%"
            head:class="pl-10 pr-7"
            gallery:class="px-10"
        />
    </div>
</template>
