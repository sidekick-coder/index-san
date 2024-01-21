<script setup lang="ts">
defineProps({
    active: {
        type: Boolean,
        default: false,
    },
})
</script>
<template>
    <IsBtn size="sm">
        <slot />
    </IsBtn>
</template>
