<script setup lang="ts">
import { MarkdownNodeParagraph } from '@language-kit/markdown'
import Block from './Block.vue'
import HTMLContentEditable from './HTMLContentEditable.vue'
import { createNodeParagraphFromHtml } from '../composables/helpers'
import { TokenType } from '@language-kit/lexer'

defineOptions({
    inheritAttrs: false,
})

const model = defineModel({
    type: MarkdownNodeParagraph,
    required: true,
})

const html = ref('')

const isEmpty = computed(() => {
    if (model.value.tokens.length > 3) return

    return model.value.tokens.every((token) =>
        [TokenType.BreakLine, TokenType.EndOfFile].includes(token.type as any)
    )
})

function load() {
    html.value = model.value.children
        .map((c) => c.toHtml())
        .join('')
        .replaceAll(' ', '&nbsp;')
}

function update() {
    const node = createNodeParagraphFromHtml(html.value)

    node.meta = model.value.meta

    model.value = node
}

function onBlur() {
    update()
}

watch(model, load, { immediate: true })
</script>
<template>
    <block v-model="model" :class="isEmpty ? 'hidden' : ''">
        <HTMLContentEditable
            v-model="html"
            @blur="onBlur"
            @keydown.enter.prevent="update"
            @keydown.ctrl.s="update"
        />
    </block>
</template>
