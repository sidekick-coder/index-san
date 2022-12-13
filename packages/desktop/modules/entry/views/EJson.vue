<script setup lang="ts">
import EEditor from '../components/EEditor.vue'

defineProps({
    path: {
        type: String,
        required: true,
    },
})
</script>
<template>
    <e-editor :path="path" language="json" />
</template>
