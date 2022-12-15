<script lang="ts" setup>
defineProps({
    padding: {
        type: Boolean,
        default: false,
    },
})
</script>
<template>
    <div
        class="w-full py-2 flex items-center border-b border-lines"
        :class="[padding ? 'px-4' : '']"
    >
        <slot />
    </div>
</template>
