<script setup lang="ts">
defineProps({
    entryId: {
        type: String,
        default: '/',
    },
})
</script>

<template>
    <router-view />
</template>
