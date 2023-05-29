<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import MBlock from './NodeEditorBlock.vue'
import MHtml from './NodeEditorRenderer.vue'
import { Node as MarkdownNode, MarkdownToken, NodeType, Parser } from '@language-kit/markdown'
import { useManger } from '../composable/nodes-manager'
import { useFocusList } from '../composable/focus-list'
import { Token } from '@language-kit/lexer'
import { useCursorHelper } from '../composable/cursor'
import { NodeWithId } from '../types/node'

// Props & Emit

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

    const isEqual = value === html.value

    if (isEqual) return

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

// watch(model, load)

onMounted(load)

// keybindings

const manager = useManger()
const focusList = useFocusList('[data-block] [contenteditable]')
const cursor = useCursorHelper()

const content = ref<HTMLElement>()

function onBackspace(e: KeyboardEvent) {
    if (!cursor.isCaretOnStart()) return

    e.preventDefault()

    focusList.focus(-1)

    cursor.setCaretOnEnd()

    manager.removeNode(model.value)
}

function onDeleteKeypress(e: KeyboardEvent) {
    const haveText = model.value.toText().trim().length > 0

    if (haveText) return

    e.preventDefault()

    manager.removeNode(model.value)
}

function addNewNode(e: KeyboardEvent) {
    e.preventDefault()

    const paragraph = new MarkdownNode({
        type: NodeType.Paragraph,
        tokens: [Token.breakLine()],
    })

    if (cursor.isCaretOnStart()) {
        manager.addNodeBefore(model.value, paragraph)
    }

    if (!cursor.isCaretOnStart()) {
        manager.addNodeAfter(model.value, paragraph)
    }

    setTimeout(() => {
        focusList.focus(1)
    }, 50)
}

onKeyStroke('Backspace', onBackspace, {
    target: content,
})

onKeyStroke('Delete', onDeleteKeypress, {
    target: content,
})

onKeyStroke('Enter', addNewNode, {
    target: content,
})
</script>

<template>
    <m-block :node="model">
        <m-html
            ref="content"
            :model-value="html"
            data-block-focusable
            @update:model-value="update"
        />
    </m-block>
</template>
