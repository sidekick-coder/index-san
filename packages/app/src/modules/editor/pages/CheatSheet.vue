<script setup lang="ts">
import CheatSheetText from './CheatSheet.md?raw'
import Editor from '../components/Editor.vue'

const text = ref(CheatSheetText)
</script>

<template>
    <Editor v-model="text" />
</template>
