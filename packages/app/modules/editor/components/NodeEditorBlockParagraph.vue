<script setup lang="ts">
import NodeEditorBlock from './NodeEditorBlock.vue'
import NodeEditorRenderer from './NodeEditorRenderer.vue'
import { MarkdownNodeNodeType, MarkdownParser, MarkdownNodeArray } from '@language-kit/markdown'
import { Token } from '@language-kit/lexer'
import { NodeWithId } from '../types/node'
import { useNodeEditor } from '../composable/node-editor'
import NodeEditorToolbarTextFormat from './NodeEditorToolbarTextFormat.vue'

const model = defineModel({
    type: NodeWithId,
    required: true,
})

const parser = new MarkdownParser()
const editor = useNodeEditor()
const renderRef = ref<InstanceType<typeof NodeEditorRenderer>>()

const html = ref('')

function load() {
    const { node } = model.value

    if (!node.is(MarkdownNodeNodeType.Paragraph)) {
        return
    }

    html.value = (node.children as MarkdownNodeArray).toHtml()
}

function htmlToMarkdown(source: string) {
    let result = source

    // replace <strong>Text</strong> to **Text**
    result = result.replaceAll(/<strong>([^<]+)<\/strong>/g, '**$1**')

    // replace <em>Text</em> to *Text*
    result = result.replaceAll(/<em>([^<]+)<\/em>/g, '*$1*')

    // replace <s>Text</s> to ~~Text~~
    result = result.replaceAll(/<s>([^<]+)<\/s>/g, '~~$1~~')

    // replace <span {attrs}>Text</span> to [Text]{attrs}
    result = result.replaceAll(/<span\s+([^>]+)>([^<]+)<\/span>/g, '[$2]{ $1 }')

    return result
}

function update(newHtml: string) {
    html.value = newHtml

    const markdown = htmlToMarkdown(newHtml)

    const tokens = parser.toTokens(markdown)

    const lastIndex = tokens.length - 1
    const breakLine = Token.breakLine()

    tokens.splice(lastIndex, 0, breakLine as any)

    model.value.node.tokens = tokens

    model.value = model.value
}

function onTextFormat() {
    if (!renderRef.value) return

    renderRef.value.update()
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
    <NodeEditorBlock
        :class="model.isBreakLine() ? 'hidden' : ''"
        :node="model"
        @on-select="onBlockSelected"
        @on-unselect="onBlockUnselected"
    >
        <template #toolbar-tools>
            <NodeEditorToolbarTextFormat :model-value="model" @change="onTextFormat" />
        </template>
        <NodeEditorRenderer ref="renderRef" :model-value="html" @update:model-value="update" />
    </NodeEditorBlock>
</template>
