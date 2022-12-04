<script setup lang="ts">
defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    entryId: {
        type: String,
        default: '/',
    },
})
</script>

<template>
    <is-entry-view-folder :workspace-id="workspaceId" :path="entryId" />
</template>
