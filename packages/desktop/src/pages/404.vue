<script setup lang="ts">
import { definePageMeta } from '@/composables/page-meta'

definePageMeta({
    title: 'Not found',
})
</script>
<template>
    <div class="flex h-full w-full items-center justify-center">
        <div class="text-center">
            <div class="text-2xl font-bold">Page Not Found</div>

            <div class="text-xl">Error 404</div>
        </div>
    </div>
</template>
