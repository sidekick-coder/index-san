<script setup lang="ts">
import { openURL } from '@/composables/externals'

defineProps({
    href: {
        type: String,
        default: '',
    },
})
</script>
<template>
    <a :href="href" @click.prevent="openURL(href)">
        <slot />
    </a>
</template>
