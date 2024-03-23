<script lang="ts" setup>
import { useMeta } from '@composables/metas'
import { useStore } from '@modules/collection/store'

import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import CViewGroup from '@modules/collection/components/CViewGroup.vue'

const props = defineProps({
    collectionId: {
        type: String,
        required: true,
    },
})

const store = useStore()
const router = useRouter()

const collection = computed(() => store.get(props.collectionId))

watch(
    () => props.collectionId,
    () => {
        if (!collection.value) {
            router.push('/404')
        }
    },
    { immediate: true }
)

// set meta
const meta = useMeta()

function load() {
    meta.value.title = collection.value?.name ?? props.collectionId
}

watch(() => props.collectionId, load, {
    immediate: true,
})
</script>
<template>
    <div
        v-if="collection"
        class="w-full h-full"
    >
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
