<script setup lang="ts">
import MBlock from './NodeEditorBlock.vue'
import { Node as MarkdownNode, MarkdownToken, NodeType, Parser } from '@language-kit/markdown'
import NodeEditorRenderer from './NodeEditorRenderer.vue'

import debounce from 'lodash/debounce'
import { NodeWithId } from '../types/node'

const model = defineModel({
    type: NodeWithId,
    required: true,
})

const html = ref('')
const level = ref(1)
const parser = new Parser()

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
    const breakLine = MarkdownToken.breakLine()

    tokens.splice(lastIndex, 0, breakLine as any)

    const node = new NodeWithId(model.value.id, {
        type: NodeType.Heading,
        tokens,
    })

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

watch(model, setLevel)
</script>

<template>
    <m-block :node="model" class="md-heading">
        <component :is="'h' + level">
            <NodeEditorRenderer :model-value="html" @update:model-value="update" />
        </component>

        <template #menu>
            <v-list-item v-for="n in 6" :key="n" @click="updateLevel(n)">
                <v-icon name="heading" class="mr-2" /> Heading {{ n }}
            </v-list-item>
        </template>
    </m-block>
</template>

<style lang="scss">
.md-heading {
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
