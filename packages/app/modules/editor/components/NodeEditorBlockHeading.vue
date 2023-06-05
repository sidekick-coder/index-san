<script setup lang="ts">
import MBlock from './NodeEditorBlock.vue'
import { MarkdownNodeNodeType, MarkdownParser } from '@language-kit/markdown'
import NodeEditorRenderer from './NodeEditorRenderer.vue'

import { NodeWithId } from '../types/node'
import { Token } from '@language-kit/lexer'
import NodeEditorBlockParagraphToolbar from './NodeEditorBlockParagraphToolbar.vue'
import NodeEditorToolbarBtn from './NodeEditorToolbarBtn.vue'

const model = defineModel({
    type: NodeWithId,
    required: true,
})

const html = ref('')
const level = ref(1)
const parser = new MarkdownParser()

function setText() {
    const tokens = model.value.tokens.filter((t) => t.value !== '#')

    const value = tokens
        .slice(1)
        .map((t) => t.value)
        .join('')
        .trim()

    html.value = value
}

function setLevel() {
    const tokens = model.value.tokens.findIndex((t) => t.value !== '#')

    level.value = tokens
}

function updateNode(text: string) {
    const tokens = parser.toTokens(text)

    const lastIndex = tokens.length - 1
    const breakLine = Token.breakLine()

    tokens.splice(lastIndex, 0, breakLine as any)

    const node = new NodeWithId(
        {
            type: MarkdownNodeNodeType.Heading,
            tokens,
        },
        model.value.id
    )

    model.value = node
}

function update(newHtml: string) {
    html.value = newHtml

    updateNode('#'.repeat(level.value) + ' ' + newHtml)
}

function updateLevel(value: number) {
    level.value = value

    const markdown = '#'.repeat(value) + ' ' + html.value

    updateNode(markdown)
}

watch(model, setText, {
    immediate: true,
})

watch(model, setLevel, {
    immediate: true,
})

// selection

const renderRef = ref<InstanceType<typeof NodeEditorRenderer>>()

function onBlockSelected() {
    if (!renderRef.value) return

    renderRef.value.focus()
}

function onBlockUnselected() {
    if (!renderRef.value) return

    renderRef.value.blur()
}
</script>

<template>
    <m-block
        :node="model"
        class="node-editor-block-heading"
        @on-select="onBlockSelected"
        @on-unselect="onBlockUnselected"
    >
        <component :is="'h' + level">
            <NodeEditorRenderer ref="renderRef" :model-value="html" @update:model-value="update" />
        </component>

        <template #toolbar-tools>
            <NodeEditorBlockParagraphToolbar v-model="model" />

            <NodeEditorToolbarBtn
                v-for="n in 6"
                :key="n"
                :active="level === n"
                @click="updateLevel(n)"
            >
                <v-icon :name="`lucide:heading-${n}`" class="mr-2 text-lg" />
            </NodeEditorToolbarBtn>
        </template>

        <template #menu-activator="{ attrs }">
            <v-btn
                v-bind="attrs"
                mode="text"
                size="none"
                class="py-1 text-t-secondary h-12"
                color="b-primary"
            >
                <v-icon :name="`lucide:heading-${level}`" class="text-lg" />
            </v-btn>
        </template>
    </m-block>
</template>

<style lang="scss">
.node-editor-block-heading {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        @apply font-bold;
    }

    h1 {
        @apply text-2xl;
    }

    h2 {
        @apply text-xl;
    }

    h3 {
        @apply text-lg;
    }
}
</style>
