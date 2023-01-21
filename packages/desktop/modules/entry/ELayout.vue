<script setup lang="ts">
import DirectoryEntry from '@core/entities/directory-entry'
import LLayout from '@modules/layout/LLayout.vue'
import { watch } from 'vue'
import { useRouter } from 'vue-router'

import { useStore } from './store'

const props = defineProps({
    entryId: {
        type: String,
        default: '/',
    },
})

// check if is item
const store = useStore()
const router = useRouter()

function check() {
    const basename = DirectoryEntry.basename(props.entryId)
    const dirname = DirectoryEntry.dirname(props.entryId)

    if (basename === '.is') return

    const collection = store.collection.collections.find(
        (c) => DirectoryEntry.normalize(c.path) === dirname
    )

    if (collection) {
        router.push(`/collections/${collection.id}/items/${basename}`)
    }
}

watch(() => props.entryId, check, {
    immediate: true,
})
</script>

<template>
    <LLayout :hide-toolbar="!store.layout.toolbar" />
</template>
