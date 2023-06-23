<script setup lang="ts">
import { MarkdownNodeParagraph } from '@language-kit/markdown'
import HTMLContentEditable from './HTMLContentEditable.vue'
import { createNodeParagraphFromHtml } from '../composables/helpers'

const model = defineModel({
    type: MarkdownNodeParagraph,
    required: true,
})

const html = ref('')

function load() {
    html.value = model.value.toHtml()
}

function onHtmlUpdate(payload: string) {
    html.value = payload

    const node = createNodeParagraphFromHtml(payload)

    model.value = node
}

watch(model, load, { immediate: true })
</script>
<template>
    <div>
        <HTMLContentEditable :model-value="html" @update:model-value="onHtmlUpdate" />
    </div>
</template>
