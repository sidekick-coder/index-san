<script setup lang="ts">
defineProps({
    active: {
        type: Boolean,
        default: false,
    },
})
</script>
<template>
    <v-btn
        size="sm"
        color="hover:text-t-primary"
        :class="active ? 'text-t-primary' : 'text-t-secondary'"
    >
        <slot />
    </v-btn>
</template>
