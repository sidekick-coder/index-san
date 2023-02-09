<script setup lang="ts">
import { computed } from 'vue'
import EEditor from '../components/EEditor.vue'

const props = defineProps({
    path: {
        type: String,
        required: true,
    },
})

const language = computed(() => {
    if (/.(md)/.test(props.path)) {
        return 'markdown'
    }

    if (/.(json)/.test(props.path)) {
        return 'json'
    }

    if (/.(js)/.test(props.path)) {
        return 'javascript'
    }

    return 'text'
})
</script>
<template>
    <e-editor :path="path" :language="language" />
</template>
