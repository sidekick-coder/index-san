<script setup lang="ts">
import MonacoEditor from '@modules/monaco/components/MEditor.vue'
import { registerLanguage } from '@modules/monaco/composable/define-language'
import mdc from '@modules/monaco/languages/mdc'

const model = defineModel({
    type: String,
    default: null,
})

registerLanguage(mdc)
</script>

<template>
    <MonacoEditor v-model="model" :language="mdc.id" />
</template>
