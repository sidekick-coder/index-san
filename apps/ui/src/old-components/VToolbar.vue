<script setup lang="ts">
defineProps({
    height: {
        type: Number,
        default: 48,
    },
})
</script>

<template>
    <div
        class="w-full flex items-center flex items-center"
        :style="{ height: `${height}px` }"
    >
        <slot />
    </div>
</template>
