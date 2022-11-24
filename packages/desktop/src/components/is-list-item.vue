<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const attrs = useAttrs()

const classes = computed(() => {
    const result: string[] = ['w-full py-3 px-4']

    if (attrs.onClick) {
        result.push('hover:bg-gray-500 cursor-pointer')
    }

    return result
})
</script>
<template>
    <div :class="classes">
        <slot />
    </div>
</template>
