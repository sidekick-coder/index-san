<script setup>
defineProps({
    name: {
        type: String,
        required: true,
    },
})
</script>
<template>
    <i>
        <fa-icon :icon="name" />
    </i>
</template>
