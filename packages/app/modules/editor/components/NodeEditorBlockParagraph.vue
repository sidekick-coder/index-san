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

// keybindings
const blockRef = ref<InstanceType<typeof NodeEditorBlock>>()

const cursor = useCursorHelper()

function onDeleteKeypress(e: KeyboardEvent) {
    const haveText = model.value.toText().trim().length > 0

    if (haveText) return

    e.preventDefault()

    if (cursor.isCaretOnStart() && e.key === 'Delete') {
        blockRef.value?.delete()
        return
    }

    blockRef.value?.delete(-1)
}
</script>

<template>
    <NodeEditorBlock
        ref="blockRef"
        :node="model"
        :disable-keybindings="['Delete', 'Backspace']"
        @on-select="onBlockSelected"
        @on-unselect="onBlockUnselected"
    >
        <NodeEditorRenderer
            ref="renderRef"
            :model-value="html"
            @keydown.delete="onDeleteKeypress"
            @update:model-value="update"
        />
    </NodeEditorBlock>
</template>
