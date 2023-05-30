<script setup lang="ts">
import NodeEditorBlock from './NodeEditorBlock.vue'
import NodeEditorRenderer from './NodeEditorRenderer.vue'
import { MarkdownToken, NodeType, Parser } from '@language-kit/markdown'
import { NodeWithId } from '../types/node'
import { useCursorHelper } from '../composable/cursor'
import { onKeyStroke } from '@vueuse/core'

const model = defineModel({
    type: NodeWithId,
    required: true,
})

const parser = new Parser()
const renderRef = ref<InstanceType<typeof NodeEditorRenderer>>()
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

    const node = new NodeWithId(
        {
            type: NodeType.Paragraph,
            tokens,
        },
        model.value.id
    )

    model.value = node
}

function onBlockSelected() {
    if (!renderRef.value) return

    renderRef.value.focus()
}

function onBlockUnselected() {
    if (!renderRef.value) return

    renderRef.value.blur()
}

onMounted(load)
</script>

<template>
    <NodeEditorBlock :node="model" @on-select="onBlockSelected" @on-unselect="onBlockUnselected">
        <NodeEditorRenderer ref="renderRef" :model-value="html" @update:model-value="update" />
    </NodeEditorBlock>
</template>
