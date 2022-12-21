<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../store'

import LLayout from '@/modules/layout/LLayout.vue'
import EFolder from '@/modules/entry/pages/EFolder.vue'

const props = defineProps({
    collectionId: {
        type: String,
        required: true,
    },
})

// set collection
const router = useRouter()
const store = useStore()

const collection = computed(() => store.get(props.collectionId))

async function load() {
    if (!collection.value) {
        router.push('/404')
    }
}

watch(() => props.collectionId, load, {
    immediate: true,
})
</script>

<template>
    <l-layout hide-toolbar>
        <e-folder v-if="collection" :path="collection.path" />
    </l-layout>
</template>
