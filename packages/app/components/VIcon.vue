<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        default: null,
    },
})
</script>
<template>
    <div class="inline-flex items-center">
        <Icon v-if="name.includes(':')" :icon="name" />
        <fa-icon v-else :icon="name" :size="size" />
    </div>
</template>
