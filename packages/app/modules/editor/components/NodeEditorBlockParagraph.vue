<script setup lang="ts">
import MBlock from './NodeEditorBlock.vue'
import NodeEditorRenderer from './NodeEditorRenderer.vue'
import { MarkdownToken, NodeType, Parser } from '@language-kit/markdown'
import { NodeWithId } from '../types/node'

const model = defineModel({
    type: NodeWithId,
    required: true,
})

const parser = new Parser()
const html = ref('')

function load() {
    const value = model.value.tokens
        .map((t) => t.value)
        .join('')
        .trim()

    html.value = value
}

function update(newHtml: string) {
    html.value = newHtml

    const tokens = parser.toTokens(newHtml)

    const lastIndex = tokens.length - 1
    const breakLine = MarkdownToken.breakLine()

    tokens.splice(lastIndex, 0, breakLine as any)

    const node = new NodeWithId(model.value.id, {
        type: NodeType.Paragraph,
        tokens,
    })

    model.value = node
}

onMounted(load)
</script>

<template>
    <MBlock :node="model">
        <NodeEditorRenderer :model-value="html" @update:model-value="update" />
    </MBlock>
</template>
