<script setup lang="ts">
defineEmits(['submit'])
</script>
<template>
    <form @submit.prevent="$emit('submit')">
        <slot />
    </form>
</template>
