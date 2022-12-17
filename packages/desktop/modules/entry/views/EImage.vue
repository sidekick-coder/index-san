<script setup lang="ts">
import EImg from '../components/EImg.vue'

defineProps({
    path: {
        type: String,
        required: true,
    },
})
</script>
<template>
    <div class="flex items-center justify-center w-full h-full">
        <e-img :path="path" />
    </div>
</template>
