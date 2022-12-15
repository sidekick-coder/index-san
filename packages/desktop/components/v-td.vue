<script setup lang="ts">
defineProps({
    noPadding: {
        type: Boolean,
        default: false,
    },
})
</script>
<template>
    <td
        class="text-left border-b border-r last:border-r-0 border-lines"
        :class="[noPadding ? 'p-0' : 'py-2 px-4']"
    >
        <slot></slot>
    </td>
</template>
