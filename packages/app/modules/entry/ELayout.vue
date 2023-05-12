<script setup lang="ts">
defineProps({
    entryId: {
        type: String,
        default: '/',
    },
})
</script>

<template>
    <v-layout use-percentage>
        <v-layout-content>
            <router-view />
        </v-layout-content>
    </v-layout>
</template>
