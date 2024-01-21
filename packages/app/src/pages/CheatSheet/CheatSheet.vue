<script setup lang="ts">
import CheatSheetText from './CheatSheet.md?raw'

const text = ref(CheatSheetText)
</script>

<template>
    <is-markdown-editor v-model="text" />
</template>
