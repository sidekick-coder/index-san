<script setup>
defineProps({
    name: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        default: null,
    },
})
</script>
<template>
    <i>
        <fa-icon :icon="name" :size="size" />
    </i>
</template>
