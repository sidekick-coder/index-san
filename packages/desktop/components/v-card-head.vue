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
        class="w-full flex items-center border-b border-lines min-h-[45px]"
        :class="[padding ? 'px-4' : '']"
    >
        <slot />
    </div>
</template>
