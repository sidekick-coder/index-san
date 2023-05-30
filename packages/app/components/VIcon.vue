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
    <i>
        <Icon v-if="name.includes(':')" :icon="name" />
        <fa-icon v-else :icon="name" :size="size" />
    </i>
</template>
