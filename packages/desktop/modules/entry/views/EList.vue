<script setup lang="ts">
import EFolder from './EFolder.vue'

defineProps({
    entryId: {
        type: String,
        default: '/',
    },
})
</script>

<template>
    <e-folder :path="entryId" />
</template>
