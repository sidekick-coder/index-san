<script setup lang="ts">
import { provideLayout } from '@composables/layout'

defineProps({
    usePercentage: {
        type: Boolean,
        default: false,
    },
})

provideLayout()
</script>

<template>
    <div
        class="overflow-hidden flex flex-wrap relative"
        :class="[usePercentage ? 'h-full w-full' : 'h-screen w-screen']"
    >
        <slot />
    </div>
</template>
