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
        class="text-left border-r last:border-r-0 border-lines"
        :class="[noPadding ? 'p-0' : 'p-2']"
    >
        <slot></slot>
    </td>
</template>
